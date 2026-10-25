"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  IconX,
  IconHeart,
  IconMenu2,
  IconSearch,
  IconShoppingBag,
  IconUserCircle,
} from "@tabler/icons-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cart-store";
import CartSheet from "@/features/product/cart-sheet";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

const accountLinks = [
  { href: "/account", label: "Account", icon: IconUserCircle },
  { href: "/wishlist", label: "Wishlist", icon: IconHeart },
];

const iconButtonClass =
  "p-1.5 text-muted-foreground transition-colors hover:text-primary hover:cursor-pointer";

const Navbar = () => {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const cartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const itemCount = useCartStore((state) => state.itemCount);

  useEffect(() => {
    fetch("/api/account/status", { credentials: "same-origin" })
      .then(
        (response) => response.json() as Promise<{ authenticated: boolean }>,
      )
      .then((result) => setAuthenticated(result.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  // Focus the input when it opens, close on Escape
  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  return (
    <>
    <nav className="w-full border-b border-border bg-background px-4 py-2 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left Section: Hamburger (mobile) / Nav Links (desktop) */}
        <div className="flex flex-1 items-center justify-start">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className={`${iconButtonClass} md:hidden`}
            >
              <IconMenu2 size={26} stroke={1.5} />
            </SheetTrigger>

            <SheetContent side="right" className="w-75 sm:w-85.5">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col px-4">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={link.href}
                            className="block border-b border-border py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>

                {/* Account Links in mobile */}
                <ul className="mt-6 flex flex-col gap-1">
                  {accountLinks.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={href}
                            className="flex items-center gap-3 py-2.5 text-base text-muted-foreground transition-colors hover:text-primary"
                          />
                        }
                      >
                        <Icon size={22} stroke={1.5} />
                        {label}
                      </SheetClose>
                    </li>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCartOpen(true)}
                    className={`${iconButtonClass} relative -ml-2 flex flex-row items-center gap-2.5`}
                  >
                    <IconShoppingBag size={26} stroke={1.5} />
                    Cart
                  </button>
                </ul>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 text-sm font-medium tracking-wide text-foreground md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Middle Section: Logo */}
        <div className="flex shrink-0 items-center justify-center">
          <Link className="group flex items-center justify-center" href="/">
            <div className="relative h-14 w-28 md:h-20 md:w-36">
              <Image
                alt="Streekala Logo"
                className="object-contain"
                fill
                sizes="(min-width: 768px) 144px, 112px"
                src="/streekala-logo.webp"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Right Section: Action Icons */}
        <div className="flex flex-1 items-center justify-end gap-1 md:gap-4">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            aria-controls="site-search"
            onClick={() => setSearchOpen((v) => !v)}
            className={iconButtonClass}
          >
            <IconSearch size={26} stroke={1.5} />
          </button>

          {/* Account + Wishlist: desktop only (they live in the menu on mobile) */}
          <div className="hidden md:inline-flex">
            <AccountMenu authenticated={authenticated} />
          </div>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={`${iconButtonClass} hidden md:inline-flex`}
          >
            <IconHeart size={26} stroke={1.5} />
          </Link>

          <button
            type="button"
            aria-label="Shopping Bag"
            onClick={() => setCartOpen(true)}
            className={`${iconButtonClass} relative hover:cursor-pointer`}
          >
            <IconShoppingBag size={26} stroke={1.5} />
            {itemCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
              />
            )}
          </button>
        </div>
      </div>
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
    <div
      id="site-search"
      inert={!searchOpen}
      className={`grid w-full bg-background transition-[grid-template-rows] duration-300 ease-out ${
        searchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 border-b border-border px-4 py-4 md:px-6"
        >
          <IconSearch size={22} stroke={1.5} className="text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setSearchOpen(false)}
            className={iconButtonClass}
          >
            <IconX size={22} stroke={1.5} />
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

function AccountMenu({ authenticated }: { authenticated: boolean | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  if (authenticated !== true) {
    return (
      <Link
        href="/account"
        aria-label="User Account"
        className={iconButtonClass}
      >
        <IconUserCircle size={26} stroke={1.5} />
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={iconButtonClass}
      >
        <IconUserCircle size={26} stroke={1.5} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-lg border border-border bg-popover p-1 text-sm shadow-lg">
          <Link
            href="/account/profile"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-muted"
          >
            My Profile
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-muted"
          >
            My Orders
          </Link>
          <Link
            href="/account/logout"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 hover:bg-muted"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
