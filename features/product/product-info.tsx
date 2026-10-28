"use client";

import { useState } from "react";
import ProductBenefits from "./product-benefits";
import { ProductSizeFilter } from "./product-size-filter";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductDetail } from "@/lib/products";
import { useCartStore } from "@/stores/cart-store";
import WishlistButton from "@/components/wishlist-button";

export default function ProductInfo({ product }: { product: ProductDetail }) {
  const sizes = Array.from(
    new Set(
      product.variants.flatMap((variant) =>
        variant.selectedOptions
          .filter(({ name }) => name.toLowerCase() === "size")
          .map(({ value }) => value),
      ),
    ),
  );

  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");

  const selectedVariant =
    product.variants.find((variant) =>
      variant.selectedOptions.some(
        ({ name, value }) =>
          name.toLowerCase() === "size" && value === selectedSize,
      ),
    ) ?? product.variants[0];

  const [isAdding, setIsAdding] = useState(false);
  const [cartError, setCartError] = useState("");

  const selectedPrice = selectedVariant?.price ?? product.price;
  const selectedCurrency = selectedVariant?.currency ?? product.currency;

  const setCartOpen = useCartStore((state) => state.setCartOpen);
  // const itemCount = useCartStore((state) => state.itemCount);

  async function handleAddToCart() {
    if (!selectedVariant || !selectedVariant.availableForSale) {
      setCartError("This variant is currently unavailable.");
      return;
    }

    setIsAdding(true);
    setCartError("");

    try {
      const existingCartId = localStorage.getItem("shopify_cart_id");

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: existingCartId,
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });

      const result: {
        cart?: {
          id: string;
          checkoutUrl: string;
        };
        error?: string;
      } = await response.json();

      if (!response.ok || !result.cart?.id) {
        throw new Error(result.error ?? "Failed to add product to cart.");
      }

      localStorage.setItem("shopify_cart_id", result.cart.id);

      setCartOpen(true);
    } catch (error) {
      setCartError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-base font-medium leading-6 text-foreground">
          {product.title}
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-primary">
            {selectedCurrency} {selectedPrice.toLocaleString("en-IN")}
          </span>
        </div>

        {sizes.length > 0 && (
          <div>
            <ProductSizeFilter
              sizes={sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            aria-label="Add to cart"
            disabled={
              isAdding || !selectedVariant || !selectedVariant.availableForSale
            }
            onClick={handleAddToCart}
            className="h-10 flex-1 text-xs transition-colors font-light tracking-[0.13em]"
          >
            {isAdding
              ? "Adding..."
              : !selectedVariant?.availableForSale
                ? "Unavailable"
                : "Add to cart"}
          </Button>

          <div className="h-10 w-10 flex items-center justify-center border border-primary bg-card">
            <WishlistButton productId={product.id} />
          </div>
        </div>

        {cartError && (
          <p role="alert" className="text-sm text-red-600">
            {cartError}
          </p>
        )}

        <div className="mt-2 flex flex-col gap-2">
          <ProductBenefits />

          <div>
            <Accordion className="w-full">
              <AccordionItem value="product-details" className="border-b">
                <AccordionTrigger className="flex w-full items-center justify-between py-4 text-left text-xs font-medium text-foreground hover:no-underline md:text-sm">
                  PRODUCT DETAILS
                </AccordionTrigger>

                <AccordionContent className="text-xs leading-[1.55] text-muted-foreground">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
