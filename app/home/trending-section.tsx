import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { getCollectionByHandle } from "@/lib/products";

const TrendingSection = async () => {
  const collection = await getCollectionByHandle("top-trending-deals");
  const products = collection?.products.slice(0, 4) ?? [];

  return (
    <Container className="mx-auto">
      <div className="flex w-full flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">
              Best trending deals
            </p>
            <h2 className="text-xl font-medium text-foreground sm:text-xl">
              Styles everyone is loving
            </h2>
          </div>
          <Link
            href="/collection/trending-top-deals"
            className="w-fit text-xs uppercase tracking-[0.08em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Shop all deals
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              href={`/product/${product.handle}`}
              key={product.id}
              className="group block min-w-0"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-2.5 top-2.5 bg-primary px-2 py-1 text-[11px] font-medium tracking-[0.12em] text-white sm:left-2.5 sm:top-2.5 sm:text-xs">
                  {product.discountPercentage
                    ? `SAVE ${product.discountPercentage}%`
                    : "Trending"}
                </span>
              </div>
              <h3 className="mt-4 text-center text-sm font-medium leading-6 text-card-foreground sm:text-base">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm leading-6">
                <span className="text-primary">
                  {product.price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: product.currency,
                  })}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TrendingSection;