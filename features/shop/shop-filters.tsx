"use client";

import { useState } from "react";
import { FILTER_OPTIONS } from "../constant";

type ShopFiltersProps = {
  selectedOccasions?: string[];
  onOccasionsChange?: (occasions: string[]) => void;
};

export function ShopFilters({
  selectedOccasions,
  onOccasionsChange,
}: ShopFiltersProps) {
  const [selectedSize, setSelectedSize] = useState("M");

  const toggleOccasion = (occasion: string) => {
    if (!onOccasionsChange) return;
    onOccasionsChange(
      selectedOccasions?.includes(occasion)
        ? selectedOccasions.filter((item) => item !== occasion)
        : [...(selectedOccasions || []), occasion],
    );
  };

  return (
    <aside className="w-full shrink-0 lg:w-70 flex flex-col gap-5" aria-label="Product filters">
      <div className="flex items-center justify-between border-b border-input pb-3">
        <h2 className="text-xs md:text-sm font-medium uppercase tracking-[0.12em]">
          Filters
        </h2>
        <button
          type="button"
          onClick={() => {
            setSelectedSize("M");
            onOccasionsChange?.([]);
          }}
          className="text-[10px] md:text-xs cursor-pointer uppercase tracking-[0.08em] text-stone-600 underline underline-offset-2 transition-colors hover:text-primary"
        >
          Clear all
        </button>
      </div>

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
                aria-pressed={selectedSize === size}
                onClick={() => setSelectedSize(size)}
                className={`h-7 w-7 border text-[10px] transition-colors hover:cursor-pointer ${
                  selectedSize === size
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-foreground text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Color
          </p>
          <div className="space-y-2">
            {FILTER_OPTIONS.colors.map((color) => (
              <label
                key={color}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:cursor-pointer"
              >
                <input type="radio" name="color" className="accent-primary" />
                {color}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Occasion
          </p>
          <div className="space-y-2">
            {FILTER_OPTIONS.occasions.map((occasion) => (
              <label
                key={occasion}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOccasions?.includes(occasion)}
                  onChange={() => toggleOccasion(occasion)}
                  className="accent-primary"
                />
                {occasion}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
