import { Container } from "@/components/container";

const skeletonProducts = Array.from({ length: 4 });

export default function WishlistLoading() {
  return (
    <Container className="mx-auto">
      <div className="w-full">
        <header className="border-b border-input pb-8">
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-9 w-52 animate-pulse rounded bg-muted" />
          <div className="mt-3 h-5 max-w-xl animate-pulse rounded bg-muted" />
        </header>

        <div
          className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 md:grid-cols-4 sm:gap-x-4"
          aria-label="Loading wishlist products"
          aria-busy="true"
        >
          {skeletonProducts.map((_, index) => (
            <div key={index} className="min-w-0">
              <div className="aspect-4/6 animate-pulse bg-muted md:aspect-[0.9]" />
              <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-9 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
