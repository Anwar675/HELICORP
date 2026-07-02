"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart, useTheme } from "./context";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Minus,
  Moon,
  Plus,
  ShoppingCart,
  Sun,
  Trash2,
  X,
} from "lucide-react";

import { Toaster, toast } from "sonner";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
function useAnalytics() {
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
          toast(`📊 Scroll milestone: ${m}% of page viewed`, {
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

export default function Home() {
  const MONO: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
  };
  const SERIF: React.CSSProperties = {
    fontFamily: "'Instrument Serif', serif",
  };
  const SANS: React.CSSProperties = { fontFamily: "'DM Sans', sans-serif" };

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
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
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            ${item.price}
                          </p>
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
                <span className="text-[11px] tracking-[0.3em] uppercase text-primary">
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
    </main>
  );
}
