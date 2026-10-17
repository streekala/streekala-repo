import Image from "next/image";
import Link from "next/link";
import {
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

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

const accountLinks = [
  { href: "/account", label: "Account", icon: IconUserCircle },
  { href: "/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/cart", label: "Cart", icon: IconShoppingBag },
];

const iconButtonClass =
  "p-1.5 text-muted-foreground transition-colors hover:text-primary";

const Navbar = () => {
  return (
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
            className={iconButtonClass}
          >
            <IconSearch size={26} stroke={1.5} />
          </button>

          {/* Account + Wishlist: desktop only (they live in the menu on mobile) */}
          <Link
            href="/account"
            aria-label="User Account"
            className={`${iconButtonClass} hidden md:inline-flex`}
          >
            <IconUserCircle size={26} stroke={1.5} />
          </Link>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className={`${iconButtonClass} hidden md:inline-flex`}
          >
            <IconHeart size={26} stroke={1.5} />
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping Bag"
            className={`${iconButtonClass} relative`}
          >
            <IconShoppingBag size={26} stroke={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;