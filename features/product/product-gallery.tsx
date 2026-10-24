
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type GalleryImage = {
  src: string;
  alt: string;
};

export default function ProductGallery({
  images,
}: {
  images: GalleryImage[];
}) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Mobile carousel state
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Handle an empty image list safely.
  if (images.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile: swipeable carousel */}
      <div className="md:hidden">
        <Carousel setApi={setApi} opts={{ loop: false }}>
          <CarouselContent className="ml-0">
            {images.map((image) => (
              <CarouselItem key={image.src} className="pl-0">
                <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Mobile pagination dots */}
        <div className="mt-3 flex justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to image ${index + 1}`}
              aria-current={current === index ? "true" : undefined}
              className={`h-2 rounded-full transition-all ${
                current === index ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: thumbnails + main image */}
      <div className="hidden gap-3 md:flex lg:gap-4">
        <div className="flex w-14 shrink-0 flex-col gap-3 sm:w-16">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`View product image ${index + 1}`}
              aria-pressed={selectedImage === index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-4/5 overflow-hidden border bg-muted transition-colors ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent"
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
            src={images[selectedImage].src}
            alt={images[selectedImage].alt}
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
