import Link from "next/link";
import ProductGallery from "./product-gallery";
import ProductInfo from "./product-info";
import { Container } from "@/components/container";
import RelatedSection from "./related-section";

export default function ProductPage() {
  return (
    <Container className="mx-auto">
      <div className="w-full flex flex-col gap-4 md:gap-10">
        <div className="mx-auto md:max-w-6xl pb-10 flex flex-col gap-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>›</span>
            <Link href="/shop" className="hover:text-primary">
              Sarees
            </Link>
            <span>›</span>
            <span className="text-primary">Regal Gold Saree</span>
          </nav>

          <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <ProductGallery />
            <ProductInfo />
          </div>
        </div>
        <RelatedSection />
      </div>
    </Container>
  );
}
