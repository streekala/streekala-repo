"use client";

import Image from "next/image";
import { IconHeart } from "@tabler/icons-react";
import { useState } from "react";
import { Product } from "../constant";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[0.9] overflow-hidden border-y border-border bg-primary/foreground">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 42vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.label && (
          <span className="absolute left-2 top-3 bg-primary-foreground px-1.5 py-1 text-[9px] text-primary font-medium uppercase tracking-[0.08em]">
            {product.label}
          </span>
        )}
        <button
          type="button"
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          onClick={() => setIsWishlisted((value) => !value)}
          className="absolute bottom-2 right-2 rounded-full bg-primary-foreground p-1.5 text-primary transition-colors hover:text-primary hover:cursor-pointer"
        >
          <IconHeart size={18} stroke={1.5} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <h3 className="mt-2 text-xs font-medium text-card-foreground">{product.name}</h3>
      <p className="text-[10px] text-muted-foreground">{product.description}</p>
      <p className="mt-1 text-xs font-medium text-primary">{product.price}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-2 w-full font-medium uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary hover:text-white"
      >
        Add to cart
      </Button>
    </article>
  );
}
