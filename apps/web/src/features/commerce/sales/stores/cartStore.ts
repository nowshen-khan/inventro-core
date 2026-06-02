import { create } from "zustand";

type CartItem = {
  variantId: string;

  productName: string;

  sku: string;

  attributes?: string;

  quantity: number;

  price: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;

  removeItem: (variantId: string) => void;

  increaseQty: (variantId: string) => void;

  decreaseQty: (variantId: string) => void;

  clearCart: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.variantId === item.variantId);

      /*
            if exists
            increase qty
          */

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.variantId === item.variantId
              ? {
                  ...i,

                  quantity: i.quantity + item.quantity,
                }
              : i,
          ),
        };
      }

      /*
            add new
          */

      return {
        items: [...state.items, item],
      };
    }),

  removeItem: (variantId) =>
    set((state) => ({
      items: state.items.filter((i) => i.variantId !== variantId),
    })),

  increaseQty: (variantId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.variantId === variantId
          ? {
              ...i,

              quantity: i.quantity + 1,
            }
          : i,
      ),
    })),

  decreaseQty: (variantId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.variantId === variantId
            ? {
                ...i,

                quantity: i.quantity - 1,
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  clearCart: () =>
    set({
      items: [],
    }),

  updateQuantity: (variantId, qty) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.variantId === variantId
            ? {
                ...i,
                quantity: qty,
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),
}));
