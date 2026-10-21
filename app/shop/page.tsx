import { connection } from "next/server";
import ShopPage from "@/features/shop/shop-page";
import { getProducts } from "@/lib/products";

export const instant = false;

export default async function Shop() {
  await connection();
  const products = await getProducts();

  return <ShopPage products={products} />;
}
