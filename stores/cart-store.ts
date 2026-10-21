import { create } from "zustand";

type CartStore = {
    isCartOpen: boolean;
    itemCount: number;
    setItemCount: (count: number) => void;
    openCart: () => void;
    closeCart: () => void;
    setCartOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
    isCartOpen: false,
    itemCount: 0,
    
    setItemCount: (count) => set({ itemCount: count }),
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    setCartOpen: (open) => set({ isCartOpen: open }),
}));