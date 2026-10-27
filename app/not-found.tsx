import Link from "next/link";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Page Not Found",
  description:
    "The Streekala page you requested could not be found. Explore our women's fashion collection instead.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center">
      <Container className="mx-auto justify-center mt-24">
        <div className="w-full max-w-2xl text-center">
          <p className="text-7xl font-medium tracking-tight text-primary sm:text-9xl">
            404
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-secondary">
            A little detour
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            This page has wandered off
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-muted-foreground">
            We couldn&apos;t find the page you were looking for. Let&apos;s get
            you back to something beautiful.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/">
              <Button size="lg" className="px-6">
                <IconHome size={18} stroke={1.8} />
                Back to home
              </Button>
            </Link>
            <Link
              href="/shop"
            >
              <Button variant="outline" size="lg" className="px-6">
              <IconArrowLeft size={18} stroke={1.8} />
              Explore the shop
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
