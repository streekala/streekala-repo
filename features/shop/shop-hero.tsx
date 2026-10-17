import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { ShopToolbar } from "./shop-toolbar";

interface ShopHeroProps {
  sort: string;
  onSortChange: Dispatch<SetStateAction<string>>;
}

const ShopHero = ({ sort, onSortChange }: ShopHeroProps) => {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex flex-row gap-2">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="text-muted-foreground">›</span>
        <span>Shops</span>
        <span className="text-muted-foreground">›</span>
        <span>Suits</span>
      </nav>

      <header className="mt-5 flex flex-col gap-5 border-b border-input pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
            Exclusive Suits
          </p>
          <h1 className="text-sm text-foreground sm:text-sm">
            Discover our curated collection of elegant suits, meticulously
            crafted for modern grace and traditional charm. Perfect for every
            occasion, from festive celebrations to intimate gatherings.
          </h1>
        </div>
        <ShopToolbar sort={sort} onSortChange={onSortChange} />
      </header>
    </>
  );
};

export default ShopHero;
