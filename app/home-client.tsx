"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PRODUCTS, type Product, useCart, useTheme } from "./context";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Heart,
  Menu,
  Minus,
  Moon,
  Plus,
  Shield,
  ShoppingCart,
  Star,
  Sun,
  Trash2,
  Wifi,
  X,
  Zap,
} from "lucide-react";

import { Toaster, toast } from "sonner";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Chatbot } from "./chatbot";

function validate(name: string, email: string, phone: string) {
  const errs: Record<string, string> = {};
  if (!name.trim()) errs.name = "Name is required";
  if (!email.trim()) errs.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errs.email = "Enter a valid email address";
  if (phone && !/^[+\d\s\-()]{7,15}$/.test(phone))
    errs.phone = "Enter a valid phone number";
  return errs;
}

export function useAnalytics() {
  const milestones = useRef(new Set<number>());

  useEffect(() => {
    const onScroll = () => {
      const pct = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100,
      );
      [25, 50, 75, 100].forEach((m) => {
        if (pct >= m && !milestones.current.has(m)) {
          milestones.current.add(m);
          toast(` Scroll milestone: ${m}% of page viewed`, {
            description: "Analytics event captured",
            duration: 2500,
            position: "bottom-left",
          });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trackClick = useCallback((label: string) => {
    toast(`🖱 Click: ${label}`, {
      description: "User interaction recorded",
      duration: 2000,
      position: "bottom-left",
    });
  }, []);

  return { trackClick };
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-secondary animate-pulse rounded ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 33%, rgba(255,255,255,0.04) 50%, transparent 66%)",
        backgroundSize: "300% 100%",
        animation: "shimmer 1.8s infinite",
      }}
    />
  );
}

export const MONO: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
};
const SERIF: React.CSSProperties = {
  fontFamily: "'Instrument Serif', serif",
};
export const SANS: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
};

const storyBeats = [
  {
    tag: "The Problem",
    title: "Your smartwatch knows your steps.\nNot your story.",
    body: "Current wearables flood you with data. But data without intelligence is just noise. You deserve a watch that understands context — not one that counts calories.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Person overwhelmed by health data on multiple devices",
    accent: false,
  },
  {
    tag: "The Breakthrough",
    title: "6-core neural engine.\nOn your wrist.",
    body: "NEXUS S1 runs a full AI model entirely on-device. No cloud. No lag. No privacy trade-off. Your health data never leaves your wrist — and the intelligence arrives instantly.",
    img: "produce.png",
    imgAlt: "Close-up of advanced chip technology",
    accent: true,
  },
  {
    tag: "The Result",
    title: "A watch that learns.\nA life that improves.",
    body: "After 7 days, NEXUS S1 knows your normal. After 30, it predicts your patterns. After a year, it has become the most personal health coach you've ever had.",
    img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=900&h=700&fit=crop&auto=format",
    imgAlt: "Person running with smartwatch health metrics displayed",
    accent: false,
  },
];

function StoryImage({
  img,
  imgAlt,
  accent,
}: {
  img: string;
  imgAlt: string;
  accent: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-secondary aspect-[4/3]"
    >
      {accent && (
        <div className="absolute inset-0 bg-primary/5 z-10 pointer-events-none" />
      )}
      <motion.img
        src={img}
        alt={imgAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ y }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={10}
          className={
            s <= Math.round(rating)
              ? "text-primary fill-primary"
              : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}
const specGroups = [
  {
    group: "Display",
    specs: [
      { label: "Type", value: "Micro-AMOLED" },
      { label: "Size", value: "1.8 inch" },
      { label: "Resolution", value: "476 × 396 px" },
      { label: "Peak Brightness", value: "2500 nits" },
      { label: "Refresh Rate", value: "1–60 Hz adaptive" },
    ],
  },
  {
    group: "Performance",
    specs: [
      { label: "Processor", value: "NEXUS A2 Bionic" },
      { label: "Neural Engine", value: "6-core, 18 TOPS" },
      { label: "RAM", value: "2 GB LPDDR5" },
      { label: "Storage", value: "32 GB UFS 3.1" },
      { label: "OS", value: "NexusOS 2.0" },
    ],
  },
  {
    group: "Health & Sensors",
    specs: [
      { label: "Heart Rate", value: "Optical + Electrical ECG" },
      { label: "Blood Oxygen", value: "SpO2 ±1%" },
      { label: "Temperature", value: "Skin temp ±0.1°C" },
      { label: "GPS", value: "Multi-band L1 + L5" },
      { label: "Health Metrics", value: "47+ tracked" },
    ],
  },
  {
    group: "Battery & Build",
    specs: [
      { label: "Battery", value: "600 mAh" },
      { label: "Endurance", value: "Up to 21 days" },
      { label: "Fast Charge", value: "0–80% in 45 min" },
      { label: "Water Resistance", value: "10 ATM / 100m" },
      { label: "Case Material", value: "Grade 5 Titanium" },
    ],
  },
];
const featureCards = [
  {
    icon: Heart,
    tag: "01 / Health AI",
    title: "Your body, decoded.",
    desc: "Continuous ECG, SpO2, skin temperature, and stress detection — analyzed by an on-device neural engine that learns your personal baselines.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop&auto=format",
    imgAlt: "Health monitoring sensors",
  },
  {
    icon: Zap,
    tag: "02 / Power",
    title: "21 days. Always on.",
    desc: "Adaptive power management routes processing between the AI chip and main processor, extending battery without compromising intelligence.",
    img: "https://media.istockphoto.com/id/1570061636/photo/lithium-solid-state-battery-for-ev-electric-vehicle-new-research-and-development-batteries.webp?b=1&s=170667a&w=0&k=20&c=MpfQQ_3-FHKAAGnwOK8J-iMZ3EYTDtQZfC6RgG8wSis=",
    imgAlt: "Battery technology",
  },
  {
    icon: Moon,
    tag: "03 / Display",
    title: "Invisible until needed.",
    desc: '1.8" Micro-AMOLED at 2500 nits with 1Hz adaptive refresh. Readable in direct sunlight, invisible in darkness.',
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&auto=format",
    imgAlt: "Premium AMOLED display",
  },
];

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
function ProductCard({
  product: p,
  isFav,
  onAddToCart,
  onToggleFav,
  onView,
}: {
  product: Product;
  isFav: boolean;
  onAddToCart: () => void;
  onToggleFav: () => void;
  onView: () => void;
}) {
  return (
    <motion.div
      className="bg-card flex flex-col h-full group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onView}
    >
      <div className="relative overflow-hidden bg-secondary h-52">
        <motion.img
          src={p.image}
          alt={p.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
          decoding="async"
        />
        {p.badge && (
          <span
            className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] tracking-widest uppercase px-2 py-1 font-semibold"
            style={MONO}
          >
            {p.badge}
          </span>
        )}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFav();
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          whileTap={{ scale: 0.85 }}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={14}
            className={
              isFav ? "fill-primary text-primary" : "text-muted-foreground"
            }
          />
        </motion.button>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2">
          <Stars rating={p.rating} />
          <span className="text-sm text-muted-foreground" style={MONO}>
            {p.rating} ({p.reviews.toLocaleString()})
          </span>
        </div>
        <h3
          className="text-lg font-normal text-foreground leading-snug"
          style={SERIF}
        >
          {p.name}
        </h3>
        <p
          className="text-sm text-muted-foreground leading-relaxed flex-1"
          style={SANS}
        >
          {p.description}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-2">
            <span
              className="text-lg text-foreground font-semibold"
              style={MONO}
            >
              ${p.price}
            </span>
            {p.originalPrice && (
              <span
                className="text-sm text-muted-foreground line-through"
                style={MONO}
              >
                ${p.originalPrice}
              </span>
            )}
          </div>
        </div>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 text-[11px] tracking-widest uppercase font-semibold hover:bg-primary/90 transition-colors"
          style={MONO}
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingCart size={12} /> Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "health",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const [filter, setFilter] = useState<"all" | "watch" | "band" | "accessory">(
    "all",
  );
  const inputClass =
    "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-primary";

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      setErrors((er) => {
        const n = { ...er };
        delete n[k];
        return n;
      });
    };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate(form.name, form.email, form.phone);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("success");
    trackClick("Newsletter Submit");
    toast.success("Form looks good.", {
      description: "All required fields passed validation.",
      duration: 4000,
    });
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const filtered =
    filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: "ADD", product });
    dispatch({ type: "VIEW", product });
    trackClick(`Add to cart: ${product.name}`);
    toast.success(`Added to cart`, {
      description: product.name,
      duration: 2500,
    });
  };

  const handleFavorite = (product: Product) => {
    const isFav = state.favorites.includes(product.id);
    dispatch({ type: "TOGGLE_FAV", id: product.id });
    trackClick(
      `${isFav ? "Remove from" : "Add to"} favorites: ${product.name}`,
    );
    toast(isFav ? "Removed from favorites" : "💛 Added to favorites", {
      description: product.name,
      duration: 2000,
    });
  };

  const handleView = (product: Product) => {
    dispatch({ type: "VIEW", product });
  };

  const tabs: { label: string; value: typeof filter }[] = [
    { label: "All", value: "all" },
    { label: "Watches", value: "watch" },
    { label: "Bands", value: "band" },
    { label: "Accessories", value: "accessory" },
  ];

  const { isDark, toggle } = useTheme();
  const { state, dispatch, total, count } = useCart();
  const { trackClick } = useAnalytics();
  const onCartOpen = useCallback(() => setCartOpen(true), []);
  const onCartClose = useCallback(() => setCartOpen(false), []);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <main>
      <Toaster richColors />
      <header>
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled
              ? "bg-background/95 backdrop-blur-md border-b border-border"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <span
              className="text-lg tracking-[0.25em] uppercase text-foreground font-semibold"
              style={MONO}
            >
              NEXUS
            </span>

            <ul className="hidden md:flex items-center gap-8">
              {["Features", "Products", "Specs", "Story"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    onClick={() => trackClick(`Nav: ${l}`)}
                    className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
                    style={MONO}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              {/* Dark mode toggle */}
              <button
                onClick={() => {
                  toggle();
                  trackClick("Theme Toggle");
                }}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </button>

              {/* Cart */}
              <button
                onClick={() => {
                  onCartOpen();
                  trackClick("Cart Open");
                }}
                className="relative w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={18} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center rounded-full"
                      style={MONO}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <a
                href="#order"
                onClick={() => trackClick("Nav CTA")}
                className="hidden md:inline-flex items-center gap-2 text-sm tracking-widest uppercase bg-primary text-primary-foreground px-4 py-2.5 font-semibold hover:bg-primary/90 active:scale-95 transition-all"
                style={MONO}
              >
                Pre-Order <ArrowRight size={16} />
              </a>

              <button
                className="md:hidden text-foreground"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-background border-t border-border overflow-hidden"
              >
                <div className="px-6 py-6 flex flex-col gap-5">
                  {["Features", "Products", "Specs", "Story"].map((l) => (
                    <a
                      key={l}
                      href={`#${l.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm tracking-widest uppercase text-muted-foreground"
                      style={MONO}
                    >
                      {l}
                    </a>
                  ))}
                  <a
                    href="#order"
                    className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase bg-primary text-primary-foreground px-5 py-3 font-semibold w-fit"
                    style={MONO}
                  >
                    Pre-Order <ArrowRight size={11} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close cart"
              className="fixed inset-0 z-50 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCartClose}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-6">
                <h2
                  id="cart-title"
                  className="text-sm font-semibold uppercase tracking-widest text-foreground"
                  style={MONO}
                >
                  Cart
                </h2>
                <button
                  type="button"
                  onClick={onCartClose}
                  className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Close cart"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                {state.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                    <ShoppingCart size={28} className="text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Your cart is empty.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <article
                        key={item.id}
                        className="grid grid-cols-[1fr_auto] gap-4 border-b border-border pb-4"
                      >
                        <div className="flex  justify-between">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              ${item.price}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE",
                                  id: item.id,
                                  qty: item.quantity - 1,
                                })
                              }
                              className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              <Minus size={14} />
                            </button>
                            <span
                              className="min-w-8 text-center text-xs font-semibold text-foreground"
                              style={MONO}
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: "UPDATE",
                                  id: item.id,
                                  qty: item.quantity + 1,
                                })
                              }
                              className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            dispatch({ type: "REMOVE", id: item.id })
                          }
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-border p-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <strong className="text-foreground">${total}</strong>
                </div>
                <a
                  href="#order"
                  onClick={() => {
                    onCartClose();
                    trackClick("Cart Checkout");
                  }}
                  className="flex w-full items-center justify-center gap-2 bg-primary px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                  style={MONO}
                >
                  Checkout <ArrowRight size={12} />
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <section
        ref={ref}
        id="hero"
        className="relative min-h-screen flex flex-col overflow-hidden bg-background"
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,currentColor 60px,currentColor 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,currentColor 60px,currentColor 61px)",
          }}
        />

        {/* Amber glow */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-175 h-175 rounded-full opacity-[0.06] blur-[140px] bg-primary pointer-events-none"
          style={{ y: imgY }}
        />

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col lg:flex-row items-center gap-16 flex-1"
          style={{ opacity }}
        >
          {/* Text */}
          <motion.div
            className="flex-1 flex flex-col gap-8 lg:max-w-[52%]"
            style={{ y: textY }}
          >
            <Reveal>
              <div
                className="inline-flex items-center gap-3 w-fit"
                style={MONO}
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm tracking-[0.3em] uppercase text-primary">
                  Now Available — Limited Edition
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1
                className="text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-normal text-foreground"
                style={SERIF}
              >
                The Watch
                <br />
                <em className="text-primary not-italic">That Thinks</em>
                <br />
                With You.
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p
                className="text-lg text-muted-foreground leading-relaxed max-w-md font-light"
                style={SANS}
              >
                NEXUS S1 is the world{"'"}s first smartwatch with on-device AI —
                monitoring your health, predicting your needs, and adapting to
                your life in real time.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <motion.a
                  href="#order"
                  whileHover={{ gap: "16px" }}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-widest uppercase font-semibold hover:bg-primary/90 transition-colors"
                  style={MONO}
                >
                  Pre-Order · $449 <ArrowRight size={14} />
                </motion.a>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  style={SANS}
                >
                  Explore Features <ChevronDown size={14} />
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div
                className="flex items-center gap-8 pt-4 border-t border-border"
                style={MONO}
              >
                {[
                  { v: "21", u: "days", l: "Battery" },
                  { v: "47", u: "+", l: "Health Metrics" },
                  { v: "2mm", u: "", l: "Thin Profile" },
                ].map((s) => (
                  <div key={s.l} className="flex flex-col">
                    <span className="text-2xl text-foreground font-semibold">
                      {s.v}
                      <span className="text-primary text-lg">{s.u}</span>
                    </span>
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">
                      {s.l}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </motion.div>

          {/* Product image with parallax */}
          <motion.div
            className="flex-1 flex justify-center items-center relative"
            style={{ y: imgY }}
          >
            <div className="relative w-[320px] h-80 md:w-120 md:h-120">
              <div className="absolute inset-8 rounded-full bg-primary/10 blur-3xl" />
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/15"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <img
                src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=960&h=960&fit=crop&auto=format"
                alt="NEXUS S1 AI Smartwatch front view"
                className="relative z-10 w-full h-full object-cover rounded-full"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="relative z-10 flex justify-center pb-10">
          <motion.a
            href="#features"
            className="flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-primary transition-colors"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span
              className="text-[10px] tracking-widest uppercase"
              style={MONO}
            >
              Scroll
            </span>
            <ChevronDown size={14} />
          </motion.a>
        </div>
      </section>
      <section id="story" className="bg-background py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-20 flex flex-col gap-3">
              <span
                className="text-sm tracking-[0.4em] uppercase text-primary"
                style={MONO}
              >
                The NEXUS Story
              </span>
              <h2
                className="text-[clamp(2rem,4vw,3rem)] font-normal text-foreground"
                style={SERIF}
              >
                Why we built it
                <br />
                <em>differently.</em>
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-32">
            {storyBeats.map((beat, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  i % 2 !== 0 ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Image with parallax */}
                <StoryImage
                  img={beat.img}
                  imgAlt={beat.imgAlt}
                  accent={beat.accent}
                />

                {/* Text */}
                <div className={i % 2 !== 0 ? "lg:[direction:ltr]" : ""}>
                  <Reveal delay={0.1}>
                    <span
                      className="text-sm tracking-[0.4em] uppercase text-primary mb-4 block"
                      style={MONO}
                    >
                      {beat.tag}
                    </span>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <h3
                      className="text-[clamp(1.75rem,3vw,2.5rem)] font-normal text-foreground leading-tight mb-6 whitespace-pre-line"
                      style={SERIF}
                    >
                      {beat.title}
                    </h3>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <p
                      className="text-base text-muted-foreground leading-relaxed"
                      style={SANS}
                    >
                      {beat.body}
                    </p>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="bg-background py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <span
                  className="text-sm tracking-[0.4em] uppercase text-primary mb-4 block"
                  style={MONO}
                >
                  Core Features
                </span>
                <h2
                  className="text-[clamp(2rem,4vw,3.5rem)] leading-tight font-normal text-foreground"
                  style={SERIF}
                >
                  Built different.
                  <br />
                  <em>Designed to last.</em>
                </h2>
              </div>
              <p
                className="text-base text-muted-foreground max-w-xs leading-relaxed"
                style={SANS}
              >
                Three breakthroughs in one device — each engineered to work in
                harmony.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            {featureCards.map((f, i) => (
              <Reveal key={f.tag} delay={i * 0.1}>
                <motion.article
                  className="bg-card p-8 flex flex-col gap-6 cursor-default h-full transition-colors hover:bg-secondary"
                  transition={{ duration: 0.2 }}
                >
                  <div className="overflow-hidden h-48 bg-secondary">
                    <motion.img
                      src={f.img}
                      alt={f.imgAlt}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center gap-3" style={MONO}>
                    <f.icon size={14} className="text-primary" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                      {f.tag}
                    </span>
                  </div>
                  <h3
                    className="text-2xl font-normal text-foreground leading-tight"
                    style={SERIF}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground leading-relaxed flex-1"
                    style={SANS}
                  >
                    {f.desc}
                  </p>
                </motion.article>
              </Reveal>
            ))}
          </div>

          {/* Highlights strip */}
          <div className="mt-px grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
            {[
              { icon: Cpu, label: "Neural Engine", value: "6-core, 18 TOPS" },
              {
                icon: Wifi,
                label: "Connectivity",
                value: "LTE / Wi-Fi 6 / BT 5.3",
              },
              {
                icon: Shield,
                label: "Water Resistance",
                value: "10 ATM / 100m",
              },
              { icon: Zap, label: "Fast Charge", value: "0→80% in 45 min" },
            ].map((item) => (
              <div key={item.label} className="bg-card p-8 flex flex-col gap-3">
                <item.icon size={18} className="text-primary" />
                <span
                  className="text-[10px] tracking-widest uppercase text-muted-foreground"
                  style={MONO}
                >
                  {item.label}
                </span>
                <span
                  className="text-lg text-foreground font-normal"
                  style={SERIF}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="products"
        className="bg-card py-32 px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <span
                  className="text-sm tracking-[0.4em] uppercase text-primary mb-4 block"
                  style={MONO}
                >
                  Shop NEXUS
                </span>
                <h2
                  className="text-[clamp(2rem,4vw,3rem)] font-normal text-foreground"
                  style={SERIF}
                >
                  Complete your
                  <br />
                  <em>collection.</em>
                </h2>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1 bg-secondary p-1">
                {tabs.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setFilter(t.value)}
                    className={`px-4 py-2 text-[11px] tracking-widest uppercase transition-all duration-200 ${
                      filter === t.value
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={MONO}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            <AnimatePresence>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card p-6 flex flex-col gap-4">
                      <Skeleton className="h-52 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))
                : filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <ProductCard
                        product={p}
                        isFav={state.favorites.includes(p.id)}
                        onAddToCart={() => handleAddToCart(p)}
                        onToggleFav={() => handleFavorite(p)}
                        onView={() => handleView(p)}
                      />
                    </motion.div>
                  ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <section
        id="specs"
        className="bg-background py-32 px-6 border-t border-border"
      >
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-16">
              <span
                className="text-sm tracking-[0.4em] uppercase text-primary mb-4 block"
                style={MONO}
              >
                Technical Specifications
              </span>
              <h2
                className="text-[clamp(2rem,4vw,3.5rem)] font-normal text-foreground leading-tight"
                style={SERIF}
              >
                Every number
                <br />
                <em>tells a story.</em>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-px bg-border">
            <div className="bg-card flex flex-row lg:flex-col overflow-x-auto">
              {specGroups.map((g, i) => (
                <button
                  key={g.group}
                  onClick={() => setActive(i)}
                  className={`shrink-0 px-6 py-5 text-left transition-all duration-200 border-b border-border last:border-b-0 ${
                    active === i
                      ? "bg-primary/10 border-l-2 border-l-primary text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                  style={MONO}
                >
                  <span className="text-sm tracking-widest uppercase">
                    {g.group}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-card">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {specGroups[active].specs.map((s, i) => (
                    <div
                      key={s.label}
                      className={`flex items-center justify-between px-8 py-5 ${
                        i < specGroups[active].specs.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <span
                        className="text-sm tracking-widest uppercase text-muted-foreground"
                        style={MONO}
                      >
                        {s.label}
                      </span>
                      <span
                        className="text-sm text-foreground font-medium"
                        style={MONO}
                      >
                        {s.value}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
      <section id="order" className="bg-card border-t border-border py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span
                className="text-[11px] tracking-[0.4em] uppercase text-primary"
                style={MONO}
              >
                Stay in the Loop
              </span>
              <h2
                className="text-[clamp(2rem,4vw,3.25rem)] font-normal text-foreground leading-tight"
                style={SERIF}
              >
                Be the first to
                <br />
                <em>own NEXUS S1.</em>
              </h2>
              <p
                className="text-base text-muted-foreground leading-relaxed max-w-sm"
                style={SANS}
              >
                Register your interest and get early-bird pricing, exclusive
                updates, and priority shipping when NEXUS S1 ships in Q2 2025.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                {[
                  "Early-bird price: $449 (retail $599)",
                  "Priority shipping — first batch",
                  "2-year extended warranty",
                  "Exclusive colorways for pre-orders",
                ].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                    style={SANS}
                  >
                    <Check size={14} className="text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="bg-background border border-border p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check size={28} className="text-primary" />
                    </div>
                    <div>
                      <h3
                        className="text-2xl font-normal text-foreground mb-2"
                        style={SERIF}
                      >
                        {"You're on the list."}
                      </h3>
                      <p className="text-sm text-muted-foreground" style={SANS}>
                        {"We'll be in touch before launch day."}
                      </p>
                    </div>
                    <button
                      onClick={() => setStatus("idle")}
                      className="text-[11px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
                      style={MONO}
                    >
                      Register another →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    noValidate
                  >
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="name"
                        className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                        style={MONO}
                      >
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Jane Smith"
                        className={inputClass}
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <span className="text-[11px] text-red-400" style={MONO}>
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="email"
                        className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                        style={MONO}
                      >
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="jane@example.com"
                        className={inputClass}
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-red-400" style={MONO}>
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone (optional) */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="phone"
                        className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                        style={MONO}
                      >
                        Phone{" "}
                        <span className="text-muted-foreground/50">
                          (optional)
                        </span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="+84 900 000 000"
                        className={inputClass}
                        aria-invalid={!!errors.phone}
                      />
                      {errors.phone && (
                        <span className="text-[11px] text-red-400" style={MONO}>
                          {errors.phone}
                        </span>
                      )}
                    </div>

                    {/* Interest */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="interest"
                        className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground"
                        style={MONO}
                      >
                        Primary Interest
                      </label>
                      <select
                        id="interest"
                        value={form.interest}
                        onChange={set("interest")}
                        className={`${inputClass} appearance-none cursor-pointer`}
                      >
                        <option value="health">
                          Health & Fitness Tracking
                        </option>
                        <option value="ai">AI Features</option>
                        <option value="battery">Battery Life</option>
                        <option value="design">Design & Aesthetics</option>
                      </select>
                    </div>

                    <motion.button
                      type="submit"
                      className="flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 text-[11px] tracking-widest uppercase font-semibold hover:bg-primary/90 transition-all"
                      style={MONO}
                      whileTap={{ scale: 0.98 }}
                    >
                      Register Interest <ArrowRight size={12} />
                    </motion.button>

                    <p
                      className="text-[11px] text-muted-foreground/60 text-center"
                      style={SANS}
                    >
                      Form validation runs locally. No data is sent.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
      <footer className="bg-background border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span
            className="text-lg tracking-[0.25em] uppercase text-foreground font-semibold"
            style={MONO}
          >
            NEXUS
          </span>
          <div className="flex items-center gap-8" style={MONO}>
            {["Privacy", "Terms", "Contact", "Press"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
          <span
            className="text-[10px] tracking-widest uppercase text-muted-foreground/50"
            style={MONO}
          >
            © {2026} NEXUS Technologies
          </span>
        </div>
      </footer>
      <Chatbot />
    </main>
  );
}
