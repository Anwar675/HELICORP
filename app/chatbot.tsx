"use client"
import {  useEffect, useRef, useState } from "react";
import { MONO, SANS, useAnalytics } from "./home-client";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { Bot, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  time: Date;
}

const CHATBOT_KNOWLEDGE: Array<{ patterns: RegExp; reply: string }> = [
  { patterns: /^(hi|hello|hey|xin chào|chào|good (morning|afternoon|evening))/i, reply: "Hello! 👋 I'm NEXUS Assistant. I can help you with pricing, features, battery life, shipping, and more. What would you like to know about NEXUS S1?" },
  { patterns: /price|cost|how much|bao nhiêu|giá/i, reply: "NEXUS S1 starts at **$449** for Midnight Black, or **$549** for the Titanium Edition. Pre-orders include early-bird pricing — save $150 vs retail. Which edition interests you?" },
  { patterns: /battery|charge|power|pin/i, reply: "NEXUS S1 features a 600mAh battery with up to **21 days** of endurance. Fast charging gets you **0→80% in just 45 minutes**. With always-on display, you can expect around 14 days." },
  { patterns: /health|sensor|heart|ecg|blood|stress|sleep/i, reply: "NEXUS S1 tracks **47+ health metrics** continuously: ECG, SpO2, skin temperature, stress levels, sleep stages, HRV, and more — all analyzed by the on-device AI neural engine." },
  { patterns: /display|screen|amoled|brightness/i, reply: "The **1.8\" Micro-AMOLED** display reaches **2500 nits** peak brightness — perfectly readable in direct sunlight. It features adaptive 1–60Hz refresh and always-on mode." },
  { patterns: /ship|deliver|when|arrival|launch/i, reply: "Pre-orders ship in **Q2 2025**. Standard shipping is free worldwide. Express shipping costs $25 and arrives 2–3 days after launch. We ship to 95+ countries." },
  { patterns: /return|refund|warranty|guarantee/i, reply: "NEXUS S1 includes a **1-year warranty** (2 years for pre-orders). We offer a **30-day return policy** — no questions asked full refund if you're not satisfied." },
  { patterns: /color|colour|black|titanium|silver|edition/i, reply: "NEXUS S1 is available in **Midnight Black** ($449) and **Titanium Silver** ($549). We also offer sport, heritage leather, and woven nylon bands sold separately." },
  { patterns: /ai|artificial intelligence|neural|smart/i, reply: "NEXUS S1 runs a **6-core neural engine** with 18 TOPS on-device — no cloud processing required. Your data stays private on the watch. The AI learns your patterns over 7–30 days for personalized insights." },
  { patterns: /water|swim|waterproof|resistant/i, reply: "NEXUS S1 is rated **10 ATM / 100m water resistant** — fully swimproof, suitable for snorkeling and shallow diving." },
  { patterns: /size|dimension|weight|thick|thin/i, reply: "NEXUS S1 is ultra-slim at **2mm thick** with a 44mm case. It weighs just 28g with the band. Available in one size." },
  { patterns: /compare|vs|versus|apple|samsung|garmin/i, reply: "Unlike competitors, NEXUS S1 runs AI **entirely on-device** for instant insights without cloud dependency, offers **21-day battery** (3–5× longer than Apple Watch), and uses Grade 5 Titanium at lower price points." },
  { patterns: /(thank|thanks|cảm ơn)/i, reply: "You're welcome! 😊 Is there anything else I can help you with about NEXUS S1?" },
  { patterns: /(bye|goodbye|see you|tạm biệt)/i, reply: "Goodbye! Looking forward to having you as a NEXUS customer. Pre-order now at the link above! 👋" },
];

const BOT_INTRO: ChatMessage = {
  id: "intro",
  role: "bot",
  text: "Hi! I'm NEXUS Assistant 🤖\n\nI can answer questions about NEXUS S1 — pricing, features, health tracking, battery life, shipping, and more. How can I help you today?",
  time: new Date(),
};

 export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([BOT_INTRO]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const endRef = useRef<HTMLDivElement>(null);
  const { trackClick } = useAnalytics();

  useEffect(() => {
    if (open) {
      setUnread(0);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages]);

  const getBotReply = (text: string): string => {
    for (const { patterns, reply } of CHATBOT_KNOWLEDGE) {
      if (patterns.test(text)) return reply;
    }
    return "Great question! NEXUS S1 is our flagship AI-powered smartwatch. Could you be more specific? You can ask about **pricing**, **battery life**, **health features**, **shipping**, **warranty**, or **specifications**.";
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text, time: new Date() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    trackClick(`Chatbot message: "${text.slice(0, 30)}"`);

    // Simulate AI thinking delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const reply = getBotReply(text);
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "bot", text: reply, time: new Date() };
    setMessages((m) => [...m, botMsg]);
    setTyping(false);
    if (!open) setUnread((u) => u + 1);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Format text with **bold**
  const formatText = (text: string) => {
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold">{part}</strong> : part
    );
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => { setOpen((o) => !o); setUnread(0); trackClick("Chatbot Toggle"); }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:bg-primary/90 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={20} />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={20} />
            </motion.span>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full"
              style={MONO}
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-card border border-border shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(520px, 80vh)" }}
          >
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Bot size={16} className="text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground" style={SANS}>NEXUS Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground" style={MONO}>Online — AI powered</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 shrink-0 flex items-center justify-center ${msg.role === "bot" ? "bg-primary" : "bg-secondary border border-border"}`}>
                    {msg.role === "bot" ? <Bot size={14} className="text-primary-foreground" /> : <User size={14} className="text-muted-foreground" />}
                  </div>
                  <div className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "bot" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"}`} style={SANS}>
                    <p>{formatText(msg.text)}</p>
                    <p className={`text-[9px] mt-1 opacity-50 ${msg.role === "bot" ? "" : "text-right"}`} style={MONO}>
                      {msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-2.5 items-end">
                    <div className="w-7 h-7 bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-primary-foreground" />
                    </div>
                    <div className="bg-secondary px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Quick suggestions */}
            <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
              {["Pricing", "Battery", "Health AI", "Shipping"].map((s) => (
                <button key={s} onClick={() => { setInput(s); }} className="flex-shrink-0 text-[10px] tracking-wide uppercase border border-border px-2.5 py-1 text-muted-foreground hover:border-primary hover:text-primary transition-colors" style={MONO}>{s}</button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about NEXUS S1..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                style={SANS}
              />
              <motion.button
                onClick={sendMessage}
                disabled={!input.trim() || typing}
                className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <Send size={13} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}