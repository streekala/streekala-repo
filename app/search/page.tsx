
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/search-products";
import Link from "next/link";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
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
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
    </main>
  );
}
