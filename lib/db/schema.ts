import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: text("customer_id").notNull(),
    productId: text("product_id").notNull(),
    createdAt: timestamp("created_at")
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique("wishlist_customer_product_unique").on(
      table.customerId,
      table.productId,
    ),
  ],
);