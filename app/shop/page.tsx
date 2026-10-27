import { connection } from "next/server";
import ShopPage from "@/features/shop/shop-page";
import { getProducts } from "@/lib/products";
import { createPageMetadata } from "@/lib/metadata";

export const instant = false;
export const metadata = createPageMetadata({
  title: "Shop Women's Fashion",
  description:
    "Browse Streekala's collection of women's clothing, contemporary Indian styles, and thoughtfully designed pieces for every occasion.",
  path: "/shop",
  keywords: [
    "shop women's fashion",
    "buy women's clothing online",
    "Indian clothing online",
    "women's suits",
  ],
});

type ShopPageProps = {
  searchParams: Promise<{ collection?: string | string[] }>;
};

export default async function Shop({ searchParams }: ShopPageProps) {
  await connection();
  const params = await searchParams;
  const collection = Array.isArray(params.collection)
    ? params.collection[0]
    : params.collection;
  const products = await getProducts(collection);

  return <ShopPage products={products} />;
}
