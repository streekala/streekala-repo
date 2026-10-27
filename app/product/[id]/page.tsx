import ProductPage from "@/features/product/product-page";
import { getProductByHandle } from "@/lib/products";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByHandle(id);

  if (!product) {
    return createPageMetadata({
      title: "Product Not Found",
      description: "The Streekala product you requested could not be found.",
      path: `/product/${id}`,
      noIndex: true,
    });
  }

  const description =
    product.description ||
    `Shop ${product.title} from Streekala, thoughtfully designed women's fashion for every occasion.`;

  return createPageMetadata({
    title: product.title,
    description,
    path: `/product/${product.handle}`,
    image: product.image || undefined,
    imageAlt: product.imageAlt,
    keywords: [
      product.title,
      `${product.title} women's fashion`,
      "buy women's clothing online",
      "Streekala",
    ],
  });
}

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id: handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();
  return <ProductPage product={product} />;
}
