import { connection } from "next/server";
import ShopPage from "@/features/shop/shop-page";
import { getProducts } from "@/lib/products";

export const instant = false;

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
