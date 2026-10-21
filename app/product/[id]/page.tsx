import ProductPage from "@/features/product/product-page";
import { getProductByHandle } from "@/lib/products";
import { connection } from "next/server";
import { notFound } from "next/navigation";

export const instant = false;

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
