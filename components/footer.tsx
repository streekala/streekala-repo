import Image from "next/image";
import Link from "next/link";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
} from "@tabler/icons-react";
import { Container } from "./container";

const EMAIL = "streekalabydimple7977@gmail.com";

const LINK_GROUPS = [
  {
    title: "Explore More",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Collection", href: "/shop" },
      { label: "Stores", href: "/stores" },
    ],
  },
  {
    title: "Customer Experience",
    links: [
      { label: "Shipping & Returns", href: "/shipping-returns" },
      { label: "Order Tracking", href: "/order-tracking" },
      { label: "FAQs", href: "/faqs" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
];

// TODO: replace with your real social profile URLs
const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/", icon: IconBrandInstagram },
  { label: "Facebook", href: "https://facebook.com/", icon: IconBrandFacebook },
  { label: "WhatsApp", href: "https://wa.me/", icon: IconBrandWhatsapp },
];

const linkClass =
  "text-xs md:text-sm text-muted-foreground transition-colors hover:text-primary";

export default function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-border">
      {/* ── Main footer content ── */}
      <Container className="mx-auto">
        <div className="w-full py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr_1.5fr] lg:gap-12">
            {/* ── Brand ── */}
            <div className="flex max-w-sm flex-col gap-4 sm:col-span-2 lg:col-span-1">
              <Link href="/" aria-label="Streekala home" className="w-fit">
                <div className="relative h-14 w-28 md:h-24 md:w-40">
                  <Image
                    alt="Streekala Logo"
                    className="object-contain object-left"
                    fill
                    sizes="(min-width: 768px) 160px, 112px"
                    src="/streekala-logo-girl.webp"
                  />
                </div>
              </Link>

              {/* TODO: replace with your own brand description */}
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thoughtfully designed pieces made to be loved and worn often.
                Discover our latest collections and find something that feels
                like you.
              </p>

              {/* Social icons */}
              <ul className="flex items-center gap-2 md:gap-4">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      <Icon size={22} stroke={1.5} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Link groups ── */}
            {LINK_GROUPS.map((group) => (
              <nav
                key={group.title}
                aria-label={group.title}
                className="flex flex-col items-start gap-2 md:gap-4"
              >
                <h3 className="text-base md:text-lg font-medium text-foreground">
                  {group.title}
                </h3>
                <ul className="flex flex-col md:gap-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link className={linkClass} href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* ── Contact ── */}
            <div className="flex flex-col items-start gap-2 md:gap-4">
              <h3 className="text-base md:text-lg font-medium text-foreground">
                Contact Us
              </h3>
              <a
                className={`${linkClass} flex items-center gap-2 break-all`}
                href={`mailto:${EMAIL}`}
              >
                <IconMail size={18} stroke={1.5} className="mt-0.5 shrink-0" />
                {EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Divider + Copyright ── */}
      <div className="border-t border-border">
        <Container className="mx-auto py-4 text-center">
          <p className="text-xs text-muted-foreground md:text-sm">
            © 2026 Streekala. All Rights Reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}