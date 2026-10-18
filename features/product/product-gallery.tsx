"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { productImages } from "./constant";

export default function ProductGallery() {
  const [selectedImage, setSelectedImage] = useState(0);

  // Mobile carousel state
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <>
      {/* ── Mobile (below md): swipeable carousel ── */}
      <div className="md:hidden">
        <Carousel setApi={setApi} opts={{ loop: false }}>
          <CarouselContent className="ml-0">
            {productImages.map((image, index) => (
              <CarouselItem key={image.src} className="pl-0">
                <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    // No `priority` here: this block is hidden on desktop, and
                    // priority images load even when hidden. The first slide is in
                    // view on mobile, so lazy loading still fetches it immediately.
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Dots */}
        <div className="mt-3 flex justify-center gap-2">
          {productImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
              aria-current={current === index}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop (md and up): thumbnails + main image (unchanged) ── */}
      <div className="hidden gap-3 md:flex lg:gap-4">
        <div className="flex w-14 shrink-0 flex-col gap-3 sm:w-16">
          {productImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`View product image ${index + 1}`}
              aria-pressed={selectedImage === index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-4/5 overflow-hidden border bg-muted transition-colors ${
                selectedImage === index ? "border-primary" : "border-transparent"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
        <div className="relative aspect-3/4 min-w-0 flex-1 overflow-hidden bg-muted">
          <Image
            src={productImages[selectedImage].src}
            alt={productImages[selectedImage].alt}
            fill
            priority
            sizes="(min-width: 1024px) 44vw, (min-width: 768px) 85vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}