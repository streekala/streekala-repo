import Image from "next/image";
import Link from "next/link";
import { accessories } from "./constant";
import { Button } from "@/components/ui/button";

export default function RelatedSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xs font-medium uppercase tracking-[0.13em] text-muted-foreground">Complete The Look</h2>
            <p className="max-w-lg text-sm md:text-base text-foreground">
              Curated accessories to elevate your ensemble to new heights of regal elegance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
          {accessories.map((accessory) => (
            <Link href="/shop" key={accessory.name} className="group">
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  src={accessory.image}
                  alt={accessory.name}
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {accessory.badge && (
                  <span className="absolute left-1 top-1 bg-white px-1.5 py-1 text-[7px] text-[#8b1823]">{accessory.badge}</span>
                )}
              </div>
              <h3 className="mt-2 text-xs font-medium text-card-foreground">{accessory.name}</h3>
              <p className="text-[10px] text-muted-foreground">{accessory.description}</p>
              <p className="mt-1 text-xs text-primary">{accessory.price}</p>
            </Link>
          ))}
        </div>

        <div className="flex justify-center w-full mt-4">
          <Button className="w-full md:w-fit font-light tracking-[0.13em]" size="sm">View All</Button>
        </div>
      </div>
    </section>
  );
}
