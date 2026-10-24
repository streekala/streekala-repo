"use client";

import { useEffect, useState } from "react";
import { getImageProps } from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Slide = {
  id: number;
  image: string; // desktop image
  mobileImage: string; // mobile image
  alt: string;
  title: string;
  subtitle: string;
  href: string;
  cta: string;
};

// Renders a <picture>: mobile image by default, desktop image from 768px up (Tailwind `md`).
// The browser downloads only ONE of them.
const SlideImage = ({
  slide,
  priority,
}: {
  slide: Slide;
  priority: boolean;
}) => {
  const common = {
    alt: slide.alt,
    fill: true,
    sizes: "100vw",
    priority,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: slide.image, quality: 80 });

  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({ ...common, src: slide.mobileImage, quality: 75 });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source srcSet={mobileSrcSet} />
      {}
      <img {...mobileProps} alt={slide.alt} className="object-cover" />
    </picture>
  );
};

const HeroCarousel = ({ slides }: { slides: Slide[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [autoplayPlugin] = useState(() =>
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

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

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin]}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="pl-0">
              {/* Mobile: 4:5 portrait, Desktop: 21:9 wide */}
              <div className="relative aspect-4/6 w-full md:aspect-21/12 lg:aspect-21/9">
                <SlideImage slide={slide} priority={index === 0} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === current
                ? "w-6 bg-secondary"
                : "w-2 bg-primary-foreground/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
