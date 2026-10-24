"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ProductCard } from "@/components/product-card";

export function WishlistContent() {
  const trpc = useTRPC();

  const wishlistQuery = useQuery(
    trpc.wishlist.getAll.queryOptions(),
  );

  if (wishlistQuery.isPending) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">
        Loading your wishlist...
      </p>
    );
  }

  if (wishlistQuery.isError) {
    return (
      <p className="mt-8 text-sm text-destructive">
        Unable to load your wishlist. Please try again.
      </p>
    );
  }

  const wishlistItems = wishlistQuery.data;

  if (wishlistItems.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-stone-300 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          Your wishlist is waiting for its first favourite.
        </p>

        <Link
          href="/shop"
          className="mt-4 inline-flex bg-primary px-5 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-4"
      aria-label="Wishlist products"
    >
      {wishlistItems.map((item) => (
        <Link
          href={`/product/${item.product.handle}`}
          key={item.productId}
          className="group min-w-0"
        >
          <ProductCard product={item.product} />
        </Link>
      ))}
    </div>
  );
}