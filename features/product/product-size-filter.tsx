"use client";

type ProductSizeFilterProps = {
  sizes: string[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
};

export function ProductSizeFilter({
  sizes,
  selectedSize,
  onSizeChange,
}: ProductSizeFilterProps) {
  return (
    <aside className="w-full shrink-0 lg:w-70 flex flex-col gap-5" aria-label="Product filters">
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.length > 0 ? sizes.map((size) => (
              <button
                type="button"
                key={size}
                aria-pressed={selectedSize === size}
                onClick={() => onSizeChange(size)}
                className={`h-7 w-7 border text-[10px] transition-colors hover:cursor-pointer ${
                  selectedSize === size
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-foreground text-foreground hover:border-primary"
                }`}
              >
                {size}
              </button>
            )) : (
              <p className="text-xs text-muted-foreground">
                No sizes available
              </p>
            )}
          </div>
        </fieldset>
      </div>
    </aside>
  );
}
