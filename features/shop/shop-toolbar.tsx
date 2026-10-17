"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ShopToolbarProps = {
  sort: string;
  onSortChange: (sort: string) => void;
};

export function ShopToolbar({ sort, onSortChange }: ShopToolbarProps) {
  return (
    <div className="flex items-center justify-end gap-2 text-xs md:text-sm uppercase tracking-[0.08em] text-muted-foreground">
      <label htmlFor="shop-sort">Sort by :</label>
      <Select
        value={sort}
        onValueChange={(val) => {
          if (val) onSortChange(val);
        }}
      >
        <SelectTrigger className="w-45 text-xs md:text-sm normal-case tracking-normal">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-white text-foreground">
          <SelectItem
            value="featured"
            className="cursor-pointer text-xs md:text-sm focus:bg-stone-100 focus:text-primary"
          >
            Featured
          </SelectItem>
          <SelectItem
            value="price-low"
            className="cursor-pointer text-xs md:text-sm focus:bg-stone-100 focus:text-primary"
          >
            Price: low to high
          </SelectItem>
          <SelectItem
            value="price-high"
            className="cursor-pointer text-xs md:text-sm focus:bg-stone-100 focus:text-primary"
          >
            Price: high to low
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}