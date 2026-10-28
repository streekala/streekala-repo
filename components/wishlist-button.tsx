"use client";

import { useTRPC } from "@/trpc/client";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface WishlistButtonProps {
  productId: string;
}

const WishlistButton = ({ productId }: WishlistButtonProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const wishlistQuery = useQuery(
    trpc.wishlist.isInWishlist.queryOptions({ productId }),
  );

  const refreshWishlist = async () => {
    setIsRefreshing(true);

    try {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: trpc.wishlist.getAll.queryKey(),
        }),
        queryClient.invalidateQueries({
          queryKey: trpc.wishlist.isInWishlist.queryKey({
            productId,
          }),
        }),
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const createMutation = useMutation(
    trpc.wishlist.create.mutationOptions({
      onSuccess: refreshWishlist,
    }),
  );

  const deleteMutation = useMutation(
    trpc.wishlist.delete.mutationOptions({
      onSuccess: refreshWishlist,
    }),
  );

  const isSaved = wishlistQuery.data?.isSaved ?? false;
  const isPending =
    createMutation.isPending ||
    deleteMutation.isPending ||
    isRefreshing;

  const toggleWishlist = () => {
    if (isPending || wishlistQuery.isLoading) return;

    if (isSaved) {
      deleteMutation.mutate({ productId });
    } else {
      createMutation.mutate({ productId });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isSaved}
            disabled={isPending || wishlistQuery.isLoading}
            onClick={toggleWishlist}
            className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? (
              <IconHeartFilled
                size={18}
                stroke={1.5}
                className="text-primary"
              />
            ) : (
              <IconHeart
                size={18}
                stroke={1.5}
                className="text-primary"
              />
            )}
          </button>
        }
      />
      <TooltipContent>
        <p>
          {isPending
            ? "Updating wishlist..."
            : isSaved
              ? "Remove from wishlist"
              : "Add to wishlist"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WishlistButton;