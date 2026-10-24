import { router } from "../init";
import { wishlistRouter } from "./wishlist";

export const appRouter = router({
  wishlist: wishlistRouter,
});

export type AppRouter = typeof appRouter;