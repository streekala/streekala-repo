"use client";

import Image from "next/image";
import { IconMinus, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size: string;
};

export default function CartSheet({
  open,
  onOpenChange,
  size,
}: CartSheetProps) {
  const [quantity, setQuantity] = useState(1);
  const itemTotal = 2400 * quantity;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
                (1 ITEM)
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
            <article className="flex gap-4">
              <div className="relative h-28.5 w-25.5 shrink-0 overflow-hidden border border-[#d5cdca] bg-[#f6f1ec]">
                <Image
                  src="/trending-img-5.webp"
                  alt="Regal Gold Zari Silk Saree"
                  fill
                  sizes="101px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[12px] font-medium text-[#2d292a]">
                  Regal Gold Zari Silk Saree
                </h2>
                <p className="mt-1 text-[12px] text-[#777173]">
                  Color: Emerald Green
                </p>
                <p className="mt-3 text-[9px] text-[#777173]">Size: {size}</p>
                <div className="mt-3 flex items-center gap-2 text-[10px]">
                  <span className="text-[#686163] line-through">₹ 4,450</span>
                  <span className="font-medium text-[#e0182b]">₹ 2,400</span>
                  <span className="text-[#8c8586]">(35% OFF)</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex h-5 items-center overflow-hidden rounded-full border border-[#cfc9c9] text-[11px]">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-full w-6 items-center justify-center text-[#686163] hover:text-[#8b1823]"
                    >
                      <IconMinus size={11} />
                    </button>
                    <span className="border-x border-[#cfc9c9] px-2 text-[10px]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-full w-6 items-center justify-center text-[#686163] hover:text-[#8b1823]"
                    >
                      <IconPlus size={11} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove item"
                    className="text-[#676163] hover:text-[#8b1823]"
                  >
                    <IconTrash size={14} stroke={1.5} />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="shrink-0 px-6 pb-9 pt-4">
            <div className="space-y-3 text-[10px] tracking-[0.12em] text-[#2e292a]">
              <div className="flex justify-between">
                <span>TOTAL MRP</span>
                <span className="tracking-normal">
                  ₹ {(4450 * quantity).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="tracking-normal text-[#e0182b]">
                  ₹ {itemTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
            <p className="mt-8 text-center text-[10px] text-[#302b2c]">
              Taxes and shipping calculated at checkout
            </p>
            <button
              type="button"
              className="mt-7 h-10 w-full bg-[#870d18] text-[10px] tracking-[0.13em] text-white transition-colors hover:bg-[#6d0a13]"
            >
              SECURE CHECKOUT
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
