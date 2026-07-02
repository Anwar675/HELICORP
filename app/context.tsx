"use client";

import React, { createContext, useContext, useReducer, useEffect, useState } from "react";

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

/* ─── Theme Context ──────────────────────────────────────────── */
interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem("nexus-theme") !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.toggle("light", !isDark);
    try {
      localStorage.setItem("nexus-theme", isDark ? "dark" : "light");
    } catch {}
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

/* ─── Cart Reducer ───────────────────────────────────────────── */
export interface CartState {
  items: CartItem[];
  favorites: string[];
  recentlyViewed: Product[];
}

export type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; qty: number }
  | { type: "TOGGLE_FAV"; id: string }
  | { type: "VIEW"; product: Product }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => {
    try {
      const raw = localStorage.getItem("nexus-cart");
      if (raw) return JSON.parse(raw) as CartState;
    } catch {}
    return { items: [], favorites: [], recentlyViewed: [] } as CartState;
  });

  useEffect(() => {
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
    name: "NEXUS S1 — Midnight Black",
    price: 449,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop&auto=format",
    category: "watch",
    badge: "Best Seller",
    rating: 4.9,
    reviews: 2841,
    description: "The flagship NEXUS S1 in matte midnight black with titanium chassis.",
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
    description: "Grade 5 titanium case with a brushed silver finish — for those who demand more.",
  },
  {
    id: "sport-band",
    name: "Performance Sport Band",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop&auto=format",
    category: "band",
    rating: 4.7,
    reviews: 891,
    description: "Breathable fluoroelastomer band with quick-release mechanism.",
  },
  {
    id: "leather-band",
    name: "Heritage Leather Band",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1609592424826-8d9fa7bfe3e5?w=600&h=600&fit=crop&auto=format",
    category: "band",
    badge: "New",
    rating: 4.6,
    reviews: 445,
    description: "Full-grain vegetable-tanned leather with antique brass hardware.",
  },
  {
    id: "magnetic-charger",
    name: "NEXUS Magnetic Charger",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1461088945293-0c17689e48ac?w=600&h=600&fit=crop&auto=format",
    category: "accessory",
    rating: 4.8,
    reviews: 2103,
    description: "100W magnetic fast charger with 2m braided cable.",
  },
  {
    id: "screen-protector",
    name: "Sapphire Screen Protector",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=600&fit=crop&auto=format",
    category: "accessory",
    rating: 4.5,
    reviews: 678,
    description: "9H sapphire-coated tempered glass with oleophobic coating.",
  },
];
