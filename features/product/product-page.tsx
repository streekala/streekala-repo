import Link from "next/link";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import { Container } from "@/components/container";
import RelatedSection from "./related-section";
import type { ProductDetail } from "@/lib/products";

export default function ProductPage({ product }: { product: ProductDetail }) {

  return (
    <Container className="mx-auto">
      <div className="w-full flex flex-col gap-12 md:gap-16 md:px-16">
          <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <ProductGallery images={product.images} />
            <ProductInfo product={product} />
          </div>
        <RelatedSection />
      </div>
    </Container>
  );
}
