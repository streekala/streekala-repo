"use client";

import { useState } from "react";
import { FILTER_OPTIONS } from "../constant";

type ProductSizeFilterProps = {
  selectedSize: string;
  onSizeChange: (size: string) => void;
};

export function ProductSizeFilter({
  selectedSize,
  onSizeChange,
}: {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}) {
  const [selectedProductSize, setSelectedProductSize] = useState("M");

  return (
    <aside className="w-full shrink-0 lg:w-70 flex flex-col gap-5" aria-label="Product filters">
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.sizes.map((size) => (
              <button
                type="button"
                key={size}
                aria-pressed={selectedProductSize === size}
                onClick={() => setSelectedProductSize(size)}
                className={`h-7 w-7 border text-[10px] transition-colors hover:cursor-pointer ${
                  selectedProductSize === size
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-foreground text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
