"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "../../components/product-card";
import ShopHero from "./shop-hero";
import { Container } from "@/components/container";
import Link from "next/link";
import type { Product } from "@/lib/products";

export default function ShopPage({ products }: { products: Product[] }) {
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sort === "price-low" || sort === "price-high") {
        const aPrice = a.price;
        const bPrice = b.price;
        return sort === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      }
      return 0;
    });
  }, [products, sort]);

  return (
    <Container className="mx-auto">
      <div className="w-full flex flex-col">
        <ShopHero sort={sort} onSortChange={setSort} />
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-8">
          {/* <ShopFilters
            selectedOccasions={selectedOccasions}
            onOccasionsChange={setSelectedOccasions}
          /> */}
          <section className="min-w-0 flex-1" aria-label="Suit collection">
            {visibleProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-4">
                {visibleProducts.slice(0, visibleCount).map((product) => (
                  <Link
                    href={`/product/${product.handle}`}
                    key={product.id}
                    className="group min-w-0"
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="border border-dashed border-stone-300 p-8 text-center text-sm text-stone-600">
                No styles match those occasions. Try clearing a filter.
              </p>
            )}

            {visibleCount < visibleProducts.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 6)}
                  className="bg-primary px-10 py-2.5 text-[10px] uppercase tracking-widest text-white transition-colors hover:bg-primary/90"
                >
                  Load more stylish
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
}
