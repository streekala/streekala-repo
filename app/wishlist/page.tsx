import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { Container } from "@/components/container";
import { validSession } from "@/lib/customer-auth";
import { WishlistContent } from "./wishlist-content";

export default function WishlistPage() {
  return (
    <Container className="mx-auto">
      <div className="w-full">
        <header className="border-b border-input pb-8">
          <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
            Your saved styles
          </p>

          <h1 className="mt-2 text-3xl font-medium text-foreground">
            My wishlist
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Keep the pieces you love close by and revisit them whenever you
            are ready.
          </p>
        </header>

        <Suspense
          fallback={
            <p className="mt-8 text-sm text-muted-foreground">
              Loading your wishlist...
            </p>
          }
        >
          <AuthenticatedWishlist />
        </Suspense>
      </div>
    </Container>
  );
}

async function AuthenticatedWishlist() {
  const session = await validSession(await cookies());

  if (!session) {
    redirect("/account");
  }

  return <WishlistContent />;
}