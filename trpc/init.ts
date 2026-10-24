import "server-only";

import { cookies } from "next/headers";
import { initTRPC, TRPCError } from "@trpc/server";
import { profile, validSession } from "@/lib/customer-auth";

export async function createTRPCContext(opts: { headers: Headers }) {
  let pending: Promise<string | null> | undefined;

  // Runs only when a protected procedure asks for it, then is memoized.
  const getCustomerId = () => {
    pending ??= (async () => {
      const store = await cookies();
      const session = await validSession(store);
      if (!session) return null;

      const result = await profile(session.accessToken);
      return result.customer?.id ?? null;
    })();
    return pending;
  };

  return {
    headers: opts.headers,
    getCustomerId,
  };
}

const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create();

const enforceAuthenticated = t.middleware(async ({ ctx, next }) => {
  const customerId = await ctx.getCustomerId();

  if (!customerId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Please sign in to use your wishlist.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      customerId, // typed as string from here on
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceAuthenticated);
