import { connection } from "next/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { getCollectionByHandle } from "@/lib/products";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return createPageMetadata({
      title: "Collection Not Found",
      description: "The Streekala collection you requested could not be found.",
      path: `/collection/${handle}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${collection.title} Collection`,
    description:
      collection.description ||
      `Explore the ${collection.title} collection from Streekala, featuring thoughtfully designed women's fashion.`,
    path: `/collection/${handle}`,
    keywords: [
      collection.title,
      `${collection.title} women's fashion`,
      "Streekala collection",
    ],
  });
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  await connection();
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) notFound();

  return (
    <Container className="mx-auto">
      <div className="w-full">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-row gap-2 text-xs text-muted-foreground"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span>›</span>
          <span>{collection.title}</span>
        </nav>

        <header className="mt-5 border-b border-input pb-8">
          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
            Collection
          </p>
          <h1 className="mt-2 text-2xl font-medium text-foreground">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {collection.description}
            </p>
          )}
        </header>

        {collection.products.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-4">
            {collection.products.map((product) => (
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
          <p className="mt-8 border border-dashed border-stone-300 p-8 text-center text-sm text-stone-600">
            This collection does not have any products yet.
          </p>
        )}
      </div>
    </Container>
  );
}
