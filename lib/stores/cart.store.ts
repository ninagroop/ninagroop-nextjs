import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StripeProduct, StripePrice, CartItem, CheckoutLineItem } from './stripe.types';

interface CartStore {
  cart: CartItem[];
  addToCart: (product: StripeProduct, priceId: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (priceId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getCartItems: () => CheckoutLineItem[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product, priceId, quantity) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex((item) => item.id === product.id);

        if (existingItemIndex >= 0) {
          // Product exists, update or add price variant
          const existingItem = cart[existingItemIndex];
          const existingPriceIndex = existingItem.prices.findIndex((p) => p.id === priceId);

          if (existingPriceIndex >= 0) {
            // Price variant exists, update quantity
            existingItem.prices[existingPriceIndex].quantity += quantity;
          } else {
            // Price variant doesn't exist, add it
            const newPrice = product.prices.find((p) => p.id === priceId);
            if (newPrice) {
              existingItem.prices.push({ ...newPrice, quantity });
            }
          }

          set({ cart: [...cart] });
        } else {
          // Product doesn't exist, add new item
          const newItem: CartItem = {
            ...product,
            prices: product.prices.map((price) => ({
              ...price,
              quantity: price.id === priceId ? quantity : 0,
            })).filter(p => p.quantity > 0),
          };
          set({ cart: [...cart, newItem] });
        }
      },

      removeFromCart: (id) => {
        const { cart } = get();

        if (id.startsWith('prod_')) {
          // Remove entire product
          set({ cart: cart.filter((item) => item.id !== id) });
        } else {
          // Remove specific price variant
          const updatedCart = cart.map((item) => ({
            ...item,
            prices: item.prices.map((price) =>
              price.id === id ? { ...price, quantity: 0 } : price
            ).filter((price) => price.quantity > 0),
          })).filter((item) => item.prices.length > 0);

          set({ cart: updatedCart });
        }
      },

      updateQuantity: (priceId, quantity) => {
        const { cart } = get();

        if (quantity <= 0) {
          get().removeFromCart(priceId);
          return;
        }

        const updatedCart = cart.map((item) => ({
          ...item,
          prices: item.prices.map((price) =>
            price.id === priceId ? { ...price, quantity } : price
          ),
        })).filter((item) => item.prices.some(p => p.quantity > 0));

        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),

      getTotalCount: () => {
        const { cart } = get();
        return cart.reduce((total, item) =>
          total + item.prices.reduce((itemTotal, price) => itemTotal + price.quantity, 0), 0
        );
      },

      getSubtotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) =>
          total + item.prices.reduce((priceTotal, price) =>
            priceTotal + (price.unit_amount * price.quantity), 0
          ), 0
        );
      },

      getCartItems: () => {
        const { cart } = get();
        return cart.flatMap((item) =>
          item.prices
            .filter((price) => price.quantity > 0)
            .map((price) => ({ price: price.id, quantity: price.quantity }))
        );
      },
    }),
    {
      name: 'cart-storage',
      // Only persist cart data, not methods
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
