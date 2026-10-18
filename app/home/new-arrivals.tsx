import { Container } from "@/components/container";
import Image from "next/image";
import Link from "next/link";

const arrivals = [
  {
    image: "/new-arrivals-1.webp",
    alt: "Cotton dress pattern inspiration",
    title: "Cotton Dress Patterns",
    description: "Explore breathable elegance",
  },
  {
    image: "/new-arrivals-2.webp",
    alt: "Stylish midi dress inspiration",
    title: "Stylish Midi Dresses",
    description: "Versatile styles for every occasion",
  },
  {
    image: "/new-arrivals-3.webp",
    alt: "Ethnic wear hairstyle inspiration",
    title: "Ethnic Wear Classics",
    description: "Traditional charm with modern grace",
  },
];

const NewArrivals = () => {
  return (
    <Container className="mx-auto">
      <div className="flex w-full flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">
              New arrivals
            </p>
            <h2 className="text-xl font-medium sm:text-xl text-foreground">
              Discover the latest styles
            </h2>
          </div>
          <Link
            href="/shop"
            className="w-fit text-xs uppercase tracking-[0.08em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Shop new arrivals
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
          {arrivals.map((arrival) => (
            <Link href="/shop" key={arrival.image} className="group block">
              <div className="relative aspect-4/5 overflow-hidden bg-muted">
                <Image
                  src={arrival.image}
                  alt={arrival.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                <span className="absolute left-6 top-6 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.08em]">
                  New
                </span>
              </div>
              <h3 className="mt-3 text-base font-medium leading-6 text-card-foreground">
                {arrival.title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {arrival.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default NewArrivals;