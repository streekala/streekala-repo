import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";

const deals = [
  {
    image: "/trending-img-1.webp",
    discount: "SAVE 69%",
    name: "Women Cotton Blue Yarn Dyed Kurta",
    price: "Rs. 398.99",
    originalPrice: "Rs. 1,298.99",
    alt: "Woman wearing a blue cotton kurta",
  },
  {
    image: "/trending-img-2.webp",
    discount: "SAVE 75%",
    name: "Women Cotton Green Floral Print Tunic",
    price: "Rs. 298.99",
    originalPrice: "Rs. 1,198.99",
    alt: "Woman wearing a floral cotton tunic",
  },
  {
    image: "/trending-img-3.webp",
    discount: "SAVE 60%",
    name: "Women Muslin Blue Mughal Print Kurta",
    price: "Rs. 398.99",
    originalPrice: "Rs. 998.99",
    alt: "Woman wearing a blue printed kurta",
  },
  {
    image: "/trending-img-4.webp",
    discount: "SAVE 60%",
    name: "Women Muslin Magenta Mughal Print Kurta",
    price: "Rs. 398.99",
    originalPrice: "Rs. 998.99",
    alt: "Woman wearing a magenta printed kurta",
  },
];

const TrendingSection = () => {
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
            href="/shop"
            className="w-fit text-xs uppercase tracking-[0.08em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Shop all deals
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {deals.map((deal) => (
            <Link href="/shop" key={deal.name} className="group block min-w-0">
              <div className="relative aspect-4/5 overflow-hidden bg-muted">
                <Image
                  src={deal.image}
                  alt={deal.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 480px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-2.5 top-2.5 bg-primary px-2 py-1 text-[11px] font-medium tracking-[0.12em] text-white sm:left-2.5 sm:top-2.5 sm:text-xs">
                  {deal.discount}
                </span>
              </div>
              <h3 className="mt-4 text-center text-sm font-medium leading-6 text-card-foreground sm:text-base">
                {deal.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-sm leading-6">
                <span className="text-primary">{deal.price}</span>
                <span className="text-muted-foreground line-through">
                  {deal.originalPrice}
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