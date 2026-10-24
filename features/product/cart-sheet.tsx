
"use client";

import Image from "next/image";
import { IconMinus, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image: { url: string; altText: string | null } | null;
    price: { amount: string; currencyCode: string };
    product: { title: string; handle: string };
    selectedOptions: { name: string; value: string }[];
  };
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: { edges: { node: CartLine }[] };
};

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: string;
  price?: number;
  currency?: string;
};

export default function CartSheet({
  open,
  onOpenChange,
}: CartSheetProps) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyLine, setBusyLine] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setItemCount = useCartStore((state) => state.setItemCount);

  const requestCart = useCallback(
    async (payload: Record<string, unknown>) => {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to update your cart.");
      }

      return result.cart as ShopifyCart;
    },
    []
  );

  const loadCart = useCallback(async () => {
    const cartId = localStorage.getItem("shopify_cart_id");

    if (!cartId) {
      setCart(null);
      setItemCount(0);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const nextCart = await requestCart({ action: "get", cartId });
      setCart(nextCart);
      setItemCount(nextCart.totalQuantity);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  }, [requestCart, setItemCount]);

  async function updateQuantity(line: CartLine, quantity: number) {
    if (!cart || quantity < 1 || quantity > 99) return;

    setBusyLine(line.id);
    setError("");

    try {
      const nextCart = await requestCart({
        action: "update",
        cartId: cart.id,
        lineId: line.id,
        quantity,
      });

      setCart(nextCart);
      setItemCount(nextCart.totalQuantity);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update quantity."
      );
    } finally {
      setBusyLine(null);
    }
  }

  async function removeLine(lineId: string) {
    if (!cart) return;

    setBusyLine(lineId);
    setError("");

    try {
      const nextCart = await requestCart({
        action: "remove",
        cartId: cart.id,
        lineIds: [lineId],
      });

      setCart(nextCart);
      setItemCount(nextCart.totalQuantity);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to remove this item."
      );
    } finally {
      setBusyLine(null);
    }
  }

  function checkout() {
    if (cart?.checkoutUrl) {
      window.location.assign(cart.checkoutUrl);
    }
  }

  const lines = cart?.lines.edges.map(({ node }) => node) ?? [];
  const currencyCode = cart?.cost.subtotalAmount.currencyCode ?? "INR";
  const subtotal = Number(cart?.cost.subtotalAmount.amount ?? 0);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);

        if (nextOpen) {
          void loadCart();
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-none gap-0 overflow-hidden p-0 sm:max-w-105 sm:rounded-none"
      >
        <div className="flex h-full min-h-0 flex-col bg-white">
          <div className="flex h-13.5 shrink-0 items-center justify-between border-b border-[#dedede] px-4">
            <SheetTitle className="p-0 text-[13px] font-semibold tracking-[0.02em] text-[#8b1823]">
              Shopping Bag{" "}
              <span className="font-normal text-[10px] text-[#585354]">
                ({cart?.totalQuantity ?? 0} ITEMS)
              </span>
            </SheetTitle>

            <SheetClose
              aria-label="Close shopping bag"
              className="flex size-7 items-center justify-center text-[#444] transition-colors hover:text-[#8b1823]"
            >
              <IconX size={20} stroke={1.5} />
            </SheetClose>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7">
            {loading && !cart ? (
              <p className="text-center text-sm text-[#777173]">
                Loading your shopping bag...
              </p>
            ) : error && !cart ? (
              <div className="text-center text-sm text-red-600">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void loadCart()}
                  className="mt-3 underline"
                >
                  Try again
                </button>
              </div>
            ) : lines.length === 0 ? (
              <p className="py-10 text-center text-sm text-[#777173]">
                Your shopping bag is empty.
              </p>
            ) : (
              <div className="space-y-7">
                {lines.map((line) => {
                  const size = line.merchandise.selectedOptions.find(
                    (option) => option.name.toLowerCase() === "size"
                  )?.value;

                  return (
                    <article key={line.id} className="flex gap-4">
                      <div className="relative h-28.5 w-25.5 shrink-0 overflow-hidden border border-[#d5cdca] bg-[#f6f1ec]">
                        {line.merchandise.image?.url ? (
                          <Image
                            src={line.merchandise.image.url}
                            alt={
                              line.merchandise.image.altText ??
                              line.merchandise.product.title
                            }
                            fill
                            sizes="102px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#777173]">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-[12px] font-medium text-[#2d292a]">
                          {line.merchandise.product.title}
                        </h2>

                        {line.merchandise.title !== "Default Title" && (
                          <p className="mt-1 text-[12px] text-[#777173]">
                            {line.merchandise.title}
                          </p>
                        )}

                        {size && (
                          <p className="mt-2 text-[9px] text-[#777173]">
                            Size: {size}
                          </p>
                        )}

                        <p className="mt-3 text-[10px] font-medium text-[#e0182b]">
                          {formatMoney(Number(line.merchandise.price.amount))}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex h-6 items-center overflow-hidden rounded-full border border-[#cfc9c9] text-[11px]">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={
                                line.quantity <= 1 || busyLine === line.id
                              }
                              onClick={() =>
                                void updateQuantity(line, line.quantity - 1)
                              }
                              className="flex h-full w-7 items-center justify-center text-[#686163] hover:text-[#8b1823] disabled:opacity-40"
                            >
                              <IconMinus size={11} />
                            </button>

                            <span className="border-x border-[#cfc9c9] px-3 text-[10px]">
                              {busyLine === line.id ? "…" : line.quantity}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={
                                line.quantity >= 99 || busyLine === line.id
                              }
                              onClick={() =>
                                void updateQuantity(line, line.quantity + 1)
                              }
                              className="flex h-full w-7 items-center justify-center text-[#686163] hover:text-[#8b1823] disabled:opacity-40"
                            >
                              <IconPlus size={11} />
                            </button>
                          </div>

                          <button
                            type="button"
                            aria-label="Remove item"
                            disabled={busyLine === line.id}
                            onClick={() => void removeLine(line.id)}
                            className="text-[#676163] hover:text-[#8b1823] disabled:opacity-40"
                          >
                            <IconTrash size={14} stroke={1.5} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {error && cart && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col gap-6 border-t border-[#dedede] px-6 pb-9 pt-4">
            <div className="space-y-3 text-xs tracking-[0.12em] text-[#2e292a]">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="tracking-normal text-[#e0182b]">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>

            <p className="text-center text-[10px] text-[#302b2c]">
              Taxes and shipping calculated at checkout
            </p>

            <Button
              disabled={!cart || lines.length === 0 || loading}
              onClick={checkout}
            >
              SECURE CHECKOUT
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
