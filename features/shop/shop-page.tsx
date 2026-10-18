"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import ShopHero from "./shop-hero";
import { PRODUCTS } from "../constant";
import { Container } from "@/components/container";
import Link from "next/link";

export default function ShopPage() {
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleProducts = useMemo(() => {
    const filtered = selectedOccasions.length
      ? PRODUCTS.filter((product) =>
          selectedOccasions.includes(product.category),
        )
      : PRODUCTS;

    return [...filtered].sort((a, b) => {
      if (sort === "price-low" || sort === "price-high") {
        const aPrice = Number(a.price.replace(/[^\d]/g, ""));
        const bPrice = Number(b.price.replace(/[^\d]/g, ""));
        return sort === "price-low" ? aPrice - bPrice : bPrice - aPrice;
      }
      return 0;
    });
  }, [selectedOccasions, sort]);

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
                    href={`/product/${product.id}`}
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
