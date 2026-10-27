import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/search-products";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  return createPageMetadata({
    title: query ? `Search Results for ${query}` : "Search Women's Fashion",
    description: query
      ? `Browse Streekala search results for ${query}. Discover women's fashion and contemporary Indian styles.`
      : "Search Streekala for women's clothing, contemporary Indian fashion, and your next favorite style.",
    path: "/search",
    keywords: query
      ? [query, `${query} women's fashion`, "Streekala"]
      : ["search women's fashion", "find Streekala products"],
    noIndex: true,
  });
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query ? await searchProducts(query) : [];
  const cardProducts = products.map((product) => ({
    id: product.id,
    name: product.title,
    handle: product.handle,
    category: "Suits",
    image: product.featuredImage?.url ?? "/images/placeholder.png",
    alt: product.featuredImage?.altText ?? product.title,
    description: product.description,
    price: Number(product.priceRange.minVariantPrice.amount),
  }));

  return (
    <>
      <h1 className="text-2xl font-semibold">
        {query ? `Search results for "${query}"` : "Search products"}
      </h1>

      {!query ? (
        <p className="mt-6 text-muted-foreground">
          Enter a product name in the search bar to get started.
        </p>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another product name or a different spelling.
          </p>
        </div>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.length} matching products
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cardProducts.map((product) => (
              <Link
                href={`/product/${product.handle}`}
                key={product.id}
                className="group min-w-0"
              >
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function SearchSkeleton() {
  return (
    <div>
      <div className="h-8 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-3/4 animate-pulse rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}