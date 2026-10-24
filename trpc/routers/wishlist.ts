import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";
import { getProductsByIds } from "@/lib/products";
import { protectedProcedure, router } from "../init";

const productIdSchema = z.object({
  productId: z.string().trim().min(1).max(255),
});

export const wishlistRouter = router({
  // Return the signed-in customer's saved product IDs.
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select({
        productId: wishlistItems.productId,
        createdAt: wishlistItems.createdAt,
      })
      .from(wishlistItems)
      .where(eq(wishlistItems.customerId, ctx.customerId))
      .orderBy(desc(wishlistItems.createdAt));

    const products = await getProductsByIds(rows.map((row) => row.productId));
    const productsById = new Map(products.map((product) => [product.id, product]));

    return rows.flatMap((row) => {
      const product = productsById.get(row.productId);
      return product ? [{ ...row, product }] : [];
    });
  }),

  // Add a product without creating duplicate records.
  create: protectedProcedure
    .input(productIdSchema)
    .mutation(async ({ ctx, input }) => {
      await db
        .insert(wishlistItems)
        .values({
          customerId: ctx.customerId,
          productId: input.productId,
        })
        .onConflictDoNothing();

      return { success: true };
    }),

  // Remove only the specified product belonging to this customer.
  delete: protectedProcedure
    .input(productIdSchema)
    .mutation(async ({ ctx, input }) => {
      const deleted = await db
        .delete(wishlistItems)
        .where(
          and(
            eq(wishlistItems.customerId, ctx.customerId),
            eq(wishlistItems.productId, input.productId),
          ),
        )
        .returning({ id: wishlistItems.id });

      return {
        success: true,
        removed: deleted.length > 0,
      };
    }),

  // Check whether a specific product is saved.
  isInWishlist: protectedProcedure
    .input(productIdSchema)
    .query(async ({ ctx, input }) => {
      const rows = await db
        .select({ id: wishlistItems.id })
        .from(wishlistItems)
        .where(
          and(
            eq(wishlistItems.customerId, ctx.customerId),
            eq(wishlistItems.productId, input.productId),
          ),
        )
        .limit(1);

      return { isSaved: rows.length > 0 };
    }),
});