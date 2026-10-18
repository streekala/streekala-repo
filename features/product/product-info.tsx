"use client";

import { IconHeart } from "@tabler/icons-react";
import { useState } from "react";
import ProductBenefits from "./product-benefits";
import { ProductSizeFilter } from "./product-size-filter";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CartSheet from "./cart-sheet";

export default function ProductInfo() {
  const [selectedSize, setSelectedSize] = useState("M");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs tracking-[0.04em] text-muted-foreground">
          Regal Gold Zari Women Silk Saree
        </p>
        <h1 className="text-base font-medium leading-6 text-foreground">
          Intricately woven with heritage motifs, a timeless piece for festive
          occasions.
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground line-through">
            ₹ 4,450
          </span>
          <span className="text-sm font-medium text-primary">₹ 2,400</span>
          <span className="text-[10px] text-[#5b5354]">(35% OFF)</span>
        </div>

        <div>
          <ProductSizeFilter
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            aria-label="Add to cart"
            onClick={() => setCartOpen(true)}
            className="h-10 flex-1 text-xs transition-colors font-light tracking-[0.13em]"
          >
            {cartOpen ? "Added to cart" : "Add to cart"}
          </Button>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  aria-pressed={isWishlisted}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex h-10 w-10 items-center justify-center border hover:cursor-pointer ${
                    isWishlisted
                      ? "border-[#870d18] text-[#870d18]"
                      : "border-[#ad7b7d] text-[#870d18]"
                  }`}
                >
                  <IconHeart
                    size={17}
                    stroke={1.4}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              }
            />
            <TooltipContent>
              <p>{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <ProductBenefits />

          <div>
            <Accordion className="w-full">
              <AccordionItem value="product-details" className="border-b">
                <AccordionTrigger className="flex w-full items-center justify-between py-4 text-left text-xs md:text-sm font-medium text-foreground hover:no-underline">
                  PRODUCT DETAILS
                </AccordionTrigger>
                <AccordionContent className="text-xs leading-[1.55] text-muted-foreground">
                  <p>
                    Exude timeless grace in this Regal Gold Zari Woven Silk
                    Saree. Crafted by master artisans, this piece features
                    intricate floral and paisley motifs woven deeply into the
                    rich silk fabric, culminating in a heavy, majestic pallu.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    <li>Fabric: Art Silk Blend with Zari</li>
                    <li>Pattern: Woven Zari Brocade</li>
                    <li>Saree Length: 5.5 Meters</li>
                    <li>Blouse Piece: 0.8 Meters (Unstitched)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        size={selectedSize}
      />
    </section>
  );
}
