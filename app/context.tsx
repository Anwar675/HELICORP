"use client";

import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

/* ─── Types ──────────────────────────────────────────────────── */
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "watch" | "band" | "accessory";
  badge?: string;
  rating: number;
  reviews: number;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem={false}
      storageKey="nexus-theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { resolvedTheme, setTheme, theme } = useNextTheme();
  const isDark = (resolvedTheme ?? theme ?? "dark") !== "light";

  return {
    isDark,
    toggle: () => setTheme(isDark ? "light" : "dark"),
  };
}

/* ─── Cart Reducer ───────────────────────────────────────────── */
export interface CartState {
  items: CartItem[];
  favorites: string[];
  recentlyViewed: Product[];
}

export type CartAction =
  | { type: "HYDRATE"; state: CartState }
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; qty: number }
  | { type: "TOGGLE_FAV"; id: string }
  | { type: "VIEW"; product: Product }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.state;
    case "ADD": {
      const idx = state.items.findIndex((i) => i.id === action.product.id);
      if (idx >= 0) {
        return {
          ...state,
          items: state.items.map((it, i) =>
            i === idx ? { ...it, quantity: it.quantity + 1 } : it
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, quantity: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE": {
      if (action.qty <= 0)
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      };
    }
    case "TOGGLE_FAV": {
      const favs = state.favorites.includes(action.id)
        ? state.favorites.filter((id) => id !== action.id)
        : [...state.favorites, action.id];
      return { ...state, favorites: favs };
    }
    case "VIEW": {
      const filtered = state.recentlyViewed.filter((p) => p.id !== action.product.id);
      return { ...state, recentlyViewed: [action.product, ...filtered].slice(0, 6) };
    }
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

interface CartCtx {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  total: number;
  count: number;
}

const CartContext = createContext<CartCtx>({} as CartCtx);

const emptyCartState: CartState = { items: [], favorites: [], recentlyViewed: [] };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, emptyCartState);
  const cartLoaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nexus-cart");
      if (raw) {
        dispatch({ type: "HYDRATE", state: JSON.parse(raw) as CartState });
        queueMicrotask(() => {
          cartLoaded.current = true;
        });
        return;
      }
    } catch {}
    cartLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!cartLoaded.current) return;
    try {
      localStorage.setItem("nexus-cart", JSON.stringify(state));
    } catch {}
  }, [state]);

  const total = state.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

/* ─── Product catalog ────────────────────────────────────────── */
export const PRODUCTS: Product[] = [
  {
    id: "nexus-s1-black",
    name: "NEXUS S1 — Midnight Edition",
    price: 449,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&auto=format",
    category: "watch",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 2841,
    description: "A sleek black NEXUS S1 with a vivid edge-to-edge display and all-day health tracking.",
  },
  {
    id: "nexus-s1-titanium",
    name: "NEXUS S1 — Titanium Silver",
    price: 549,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format",
    category: "watch",
    badge: "Premium",
    rating: 4.8,
    reviews: 1204,
    description: "A refined silver model with a lightweight metal case and a clean, minimalist profile.",
  },
  {
    id: "sport-band",
    name: "Performance Sport Loop",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&auto=format",
    category: "band",
    rating: 4.7,
    reviews: 891,
    description: "A sweat-resistant sport loop built for training, daily movement, and quick adjustments.",
  },
  {
    id: "leather-band",
    name: "Heritage Light Band",
    price: 79,
    image:
      "https://cdn-images.vtv.vn/2019/10/29/photo-1-1572362412108206073343.png",
    category: "band",
    badge: "New",
    rating: 4.6,
    reviews: 445,
    description: "A soft light-tone strap that gives your NEXUS a clean, classic everyday look.",
  },
  {
    id: "magnetic-charger",
    name: "Ion-X Glass Protector",
    price: 39,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4EVdIiRXKy5u2iwONXmm5BVq4eVOTzuPqrqywgvtyL5YrD0rSOMWw_rw&s=10",
    category: "accessory",
    rating: 4.8,
    reviews: 2103,
    description: "A slim tempered Ion-X glass layer designed to protect the display from daily scratches.",
  },
  {
    id: "screen-protector",
    name: "Outdoor Sport Case",
    price: 29,
    image:
      "https://fado.vn/blog/wp-content/uploads/2023/02/dong-ho-thong-minh-nhat-ban-jpg.webp",
    category: "accessory",
    rating: 4.5,
    reviews: 678,
    description: "A rugged protective case for trail runs, gym sessions, and active outdoor days.",
  },
];
