"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Calculator,
  X,
  Send,
  Sparkles,
  Check,
  Phone,
  MessageCircle,
  Truck,
  Layers,
  ChevronRight,
  HardHat,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { BRAND_INFO } from "@/lib/constants";
import { useCart } from "@/lib/context/CartContext";
import { PRODUCTS_DATA } from "@/lib/data/products";
import { calculateSlabMaterials, calculatePlasteringMaterials, SlabCalculationResult } from "@/lib/utils/calculator";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    url?: string;
    action?: string;
    sandType?: string;
    sandTons?: number;
    cementBags?: number;
    aggregatesTons?: number;
  }>;
  calculation?: any;
}

export const AIChatWidget: React.FC = () => {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "calculator">("chat");
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Do not render on Admin Portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 **Vanakkam & Welcome to Jayam Building Materials!**\n\nI am your **AI Civil Advisor & Material Estimator**. You can ask me about:\n• 🧮 **Slab & Plastering Material Calculations**\n• 💰 **Today's River Sand, M-Sand & Cement Rates**\n• 🚛 **Tipper Lorry Dispatch & Weightbridge Slips**\n• 🏗️ **Comparing River Sand vs. M-Sand**",
      timestamp: "Just now",
      suggestedActions: [
        { label: "🧮 Calculate 1200 sq.ft Slab", action: "calc_1200" },
        { label: "⚖️ River Sand vs M-Sand", action: "sand_compare" },
        { label: "💰 Today's Price List", action: "rates" },
        { label: "🚛 Transport & Delivery Info", action: "delivery" },
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculator State (RCC Slab)
  const [calcMode, setCalcMode] = useState<"slab" | "plaster">("slab");
  const [slabLength, setSlabLength] = useState<number>(30);
  const [slabWidth, setSlabWidth] = useState<number>(40);
  const [slabThickness, setSlabThickness] = useState<number>(5);
  const [slabSandType, setSlabSandType] = useState<"river-sand" | "m-sand">("river-sand");
  const [slabAddedSuccess, setSlabAddedSuccess] = useState(false);

  // Calculator State (Plastering)
  const [plasterArea, setPlasterArea] = useState<number>(800);
  const [plasterThickness, setPlasterThickness] = useState<number>(12);
  const [plasterAddedSuccess, setPlasterAddedSuccess] = useState(false);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === "chat" && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab, isOpen]);

  // Dynamic Slab Calculation
  const slabResult = calculateSlabMaterials(slabLength, slabWidth, slabThickness, slabSandType);
  const plasterResult = calculatePlasteringMaterials(plasterArea, plasterThickness);

  // Handle Sending Chat Message
  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customMessage) setInputText("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("Failed to contact AI service");

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: data.suggestedActions,
        calculation: data.calculation,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "bot-err-" + Date.now(),
          sender: "bot",
          text: `⚠️ Our AI assistant is momentarily occupied. Please call our dispatch desk directly at **${BRAND_INFO.phoneFormatted}** or chat with us on WhatsApp.`,
          timestamp: "Just now",
          suggestedActions: [
            { label: "📞 Call Dispatch Desk", url: `tel:+91${BRAND_INFO.phone}` },
            { label: "💬 WhatsApp Support", url: BRAND_INFO.whatsappUrl },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Suggested Action Click
  const handleActionClick = (action: any) => {
    if (action.url) {
      window.open(action.url, "_blank");
      return;
    }

    if (action.action === "switch_to_calculator") {
      setActiveTab("calculator");
      return;
    }

    if (action.action === "add_slab_to_cart") {
      handleAddSlabToCart(action.sandType || "river-sand", action.sandTons || 9.4, action.cementBags || 112, action.aggregatesTons || 20);
      return;
    }

    if (action.action === "add_plaster_to_cart") {
      handleAddPlasterToCart(action.sandTons || 3.7, action.cementBags || 19);
      return;
    }

    if (action.action === "calc_1200") {
      handleSendMessage("Calculate materials for 1200 sqft slab");
    } else if (action.action === "sand_compare") {
      handleSendMessage("What is the difference between River Sand and M-Sand?");
    } else if (action.action === "rates") {
      handleSendMessage("What are today's current wholesale material rates?");
    } else if (action.action === "delivery") {
      handleSendMessage("How do delivery and freight charges work?");
    } else if (action.action === "calc") {
      setActiveTab("calculator");
    } else if (action.label) {
      handleSendMessage(action.label);
    }
  };

  // Add Slab Materials directly to Cart
  const handleAddSlabToCart = (
    sandType: "river-sand" | "m-sand" = slabSandType,
    sandQty: number = slabResult.sandTons,
    cementQty: number = slabResult.cementBags,
    aggQty: number = slabResult.aggregatesTons
  ) => {
    const sandProduct = PRODUCTS_DATA.find((p) =>
      sandType === "m-sand" ? p.slug === "engineered-m-sand-concrete" : p.slug === "triple-washed-river-sand"
    );
    const cementProduct = PRODUCTS_DATA.find((p) => p.slug === "ultratech-super-cement-53-grade");
    const aggProduct = PRODUCTS_DATA.find((p) => p.slug === "crushed-blue-metal-aggregates-20mm");

    if (sandProduct) addToCart(sandProduct, sandQty);
    if (cementProduct) addToCart(cementProduct, cementQty);
    if (aggProduct) addToCart(aggProduct, aggQty);

    setSlabAddedSuccess(true);
    setTimeout(() => setSlabAddedSuccess(false), 3500);
  };

  // Add Plaster Materials directly to Cart
  const handleAddPlasterToCart = (sandQty: number = plasterResult.sandTons, cementQty: number = plasterResult.cementBags) => {
    const pSandProduct = PRODUCTS_DATA.find((p) => p.slug === "premium-p-sand-plastering");
    const cementProduct = PRODUCTS_DATA.find((p) => p.slug === "ultratech-super-cement-53-grade");

    if (pSandProduct) addToCart(pSandProduct, sandQty);
    if (cementProduct) addToCart(cementProduct, cementQty);

    setPlasterAddedSuccess(true);
    setTimeout(() => setPlasterAddedSuccess(false), 3500);
  };

  return (
    <aside aria-label="Jayam AI Assistant and Construction Calculator" className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pointer-events-auto">
      {/* 1. Floating Launch Pill / Button */}
      {!isOpen && (
        <div className="flex flex-col items-start gap-2">
          {/* Tooltip greeting (Desktop only to prevent mobile overlap) */}
          {showNotificationBadge && (
            <div className="hidden sm:flex relative bg-brand-charcoal text-white text-xs font-medium py-2 px-3.5 rounded-xl shadow-2xl border border-brand-charcoal-700 items-center gap-2 animate-bounce">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Need slab estimation or material prices?</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotificationBadge(false);
                }}
                className="text-slate-400 hover:text-white ml-1"
                aria-label="Dismiss greeting"
              >
                <X className="w-3 h-3" />
              </button>
              {/* Arrow */}
              <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-brand-charcoal border-r border-b border-brand-charcoal-700 rotate-45"></div>
            </div>
          )}

          {/* Trigger Button - Compact on Mobile, Full on Desktop */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowNotificationBadge(false);
            }}
            className="group relative flex items-center gap-2 bg-gradient-to-r from-brand-charcoal to-brand-charcoal-900 hover:from-brand-orange-600 hover:to-brand-orange-500 text-white p-2.5 sm:pl-4 sm:pr-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-brand-orange-500/50 hover:border-brand-orange-400 transition-all duration-300 transform hover:scale-105 active:scale-95"
            aria-label="Open AI Assistant and Material Calculator"
          >
            <div className="w-8 h-8 rounded-full bg-brand-orange-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            
            {/* Desktop Full Title */}
            <div className="hidden sm:block text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-brand-orange-400 group-hover:text-white transition-colors">
                AI Civil Advisor
              </div>
              <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                <Calculator className="w-3 h-3 text-brand-orange-300" />
                <span>Calculator & Rates</span>
              </div>
            </div>

            {/* Mobile Compact Label */}
            <span className="sm:hidden text-xs font-bold text-white pr-1">
              AI Calculator
            </span>

            {/* Live glowing dot */}
            <span className="hidden sm:flex ml-1 h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      )}

      {/* 2. Interactive AI Bot & Calculator Modal Window */}
      {isOpen && (
        <div className="w-[calc(100vw-32px)] sm:w-[420px] max-w-[420px] h-[580px] sm:h-[640px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-charcoal to-brand-charcoal-900 text-white p-3.5 border-b border-brand-charcoal-700 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange-500 to-brand-orange-600 flex items-center justify-center text-white shadow-md">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-white">Jayam AI Assistant</h3>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <p className="text-[10px] text-slate-300">Civil Engineering & Material Estimator</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Switchable Tabs: 💬 Chat vs 🧮 Calculator */}
            <div className="flex items-center bg-brand-charcoal-900/80 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "chat"
                    ? "bg-brand-orange-500 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask AI Advisor</span>
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "calculator"
                    ? "bg-brand-orange-500 text-white shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Material Calculator</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 💬 AI CHAT VIEW */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-brand-orange-500 text-white rounded-tr-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text.split("\n").map((line, idx) => {
                          // Simple bold replacement for markdown
                          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                          return (
                            <span
                              key={idx}
                              className="block"
                              dangerouslySetInnerHTML={{ __html: formattedLine }}
                            />
                          );
                        })}
                      </div>

                      {/* If response contains a structured calculation */}
                      {msg.calculation && msg.calculation.type === "slab" && (
                        <div className="mt-3 p-2.5 bg-brand-orange-50/70 border border-brand-orange-200 rounded-xl space-y-1.5 text-slate-800">
                          <div className="flex items-center justify-between font-bold text-brand-orange-700 text-[11px]">
                            <span>Slab Estimation ({msg.calculation.slabAreaSqFt} sq.ft)</span>
                            <span>M20 Standard</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-700">
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-slate-400 block">Sand Needed</span>
                              <span className="font-bold text-slate-900">{msg.calculation.sandTons} Tons</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-slate-400 block">Cement 53 Grade</span>
                              <span className="font-bold text-slate-900">{msg.calculation.cementBags} Bags</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-slate-400 block">20mm Aggregates</span>
                              <span className="font-bold text-slate-900">{msg.calculation.aggregatesTons} Tons</span>
                            </div>
                            <div className="bg-white p-1.5 rounded border border-slate-100">
                              <span className="text-slate-400 block">Tipper Logistics</span>
                              <span className="font-bold text-brand-orange-600">{msg.calculation.tipperTrucksNeeded} Tipper</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Suggested Action Buttons */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((action, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(action)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-orange-50 hover:bg-brand-orange-100 text-brand-orange-700 border border-brand-orange-200 transition-colors"
                            >
                              <span>{action.label}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-2xl w-fit text-xs">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-orange-500" />
                    <span>Jayam AI is calculating...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-2.5 bg-white border-t border-slate-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask e.g. '1200 sqft slab materials' or rates..."
                    className="flex-1 bg-slate-100 focus:bg-white text-slate-900 border border-slate-200 focus:border-brand-orange-500 rounded-xl px-3 py-2 text-xs focus:outline-none transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isLoading}
                    className="w-8 h-8 rounded-xl bg-brand-orange-500 hover:bg-brand-orange-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: 🧮 CONSTRUCTION CALCULATOR VIEW */}
          {activeTab === "calculator" && (
            <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 p-3.5 text-xs space-y-3">
              
              {/* Calculator Type Selector */}
              <div className="flex rounded-xl bg-white p-1 border border-slate-200 shadow-sm">
                <button
                  onClick={() => setCalcMode("slab")}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    calcMode === "slab"
                      ? "bg-brand-charcoal text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  RCC Roof Slab
                </button>
                <button
                  onClick={() => setCalcMode("plaster")}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    calcMode === "plaster"
                      ? "bg-brand-charcoal text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Wall Plastering
                </button>
              </div>

              {/* SLAB CALCULATOR FORM */}
              {calcMode === "slab" && (
                <div className="space-y-3">
                  {/* Preset quick buttons */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                      Quick Area Presets
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "600 sqft", l: 20, w: 30 },
                        { label: "1000 sqft", l: 25, w: 40 },
                        { label: "1200 sqft", l: 30, w: 40 },
                        { label: "1500 sqft", l: 30, w: 50 },
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSlabLength(preset.l);
                            setSlabWidth(preset.w);
                          }}
                          className={`py-1 px-1 text-center font-semibold rounded-lg border text-[11px] transition-all ${
                            slabLength * slabWidth === preset.l * preset.w
                              ? "bg-brand-orange-50 border-brand-orange-500 text-brand-orange-700 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimension inputs */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
                    {/* Length Slider + Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Length (Feet)</span>
                        <span className="font-bold text-brand-orange-600">{slabLength} ft</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="1"
                        value={slabLength}
                        onChange={(e) => setSlabLength(parseInt(e.target.value) || 10)}
                        className="w-full accent-brand-orange-500 cursor-pointer"
                      />
                    </div>

                    {/* Width Slider + Input */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Width (Feet)</span>
                        <span className="font-bold text-brand-orange-600">{slabWidth} ft</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="1"
                        value={slabWidth}
                        onChange={(e) => setSlabWidth(parseInt(e.target.value) || 10)}
                        className="w-full accent-brand-orange-500 cursor-pointer"
                      />
                    </div>

                    {/* Thickness Selector */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Slab Thickness</span>
                        <span className="font-bold text-slate-900">{slabThickness} Inches</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { val: 4.5, label: "4.5\"" },
                          { val: 5.0, label: "5.0\" (Standard)" },
                          { val: 6.0, label: "6.0\" (Heavy)" },
                        ].map((th) => (
                          <button
                            key={th.val}
                            type="button"
                            onClick={() => setSlabThickness(th.val)}
                            className={`py-1 text-center font-medium rounded-lg border text-[10px] transition-all ${
                              slabThickness === th.val
                                ? "bg-brand-charcoal text-white border-brand-charcoal"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {th.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sand Type Selector */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Sand Preference</span>
                        <span className="text-[10px] text-slate-500">
                          {slabSandType === "river-sand" ? "₹1,850/Ton" : "₹1,100/Ton"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSlabSandType("river-sand")}
                          className={`py-1.5 px-2 text-left rounded-lg border text-[11px] transition-all ${
                            slabSandType === "river-sand"
                              ? "bg-amber-50 border-amber-500 text-amber-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>River Sand (Grade A)</div>
                          <div className="text-[9px] text-amber-700 font-normal">Triple Washed Natural</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlabSandType("m-sand")}
                          className={`py-1.5 px-2 text-left rounded-lg border text-[11px] transition-all ${
                            slabSandType === "m-sand"
                              ? "bg-blue-50 border-blue-500 text-blue-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>VSI M-Sand (Concrete)</div>
                          <div className="text-[9px] text-blue-700 font-normal">IS 383 Zone II Crushed</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Live Calculation Output Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-brand-charcoal text-white p-3.5 rounded-2xl shadow-md space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Slab Area</span>
                        <span className="font-extrabold text-base text-brand-orange-400">
                          {slabResult.slabAreaSqFt.toLocaleString()} sq.ft
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Material Total</span>
                        <span className="font-extrabold text-base text-emerald-400">
                          ₹{slabResult.totalEstimatedCost.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown 4 KPIs */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">
                          {slabSandType === "river-sand" ? "River Sand" : "M-Sand"}
                        </span>
                        <span className="font-bold text-white text-xs">{slabResult.sandTons} Tons</span>
                        <span className="text-slate-400 text-[9px] block">~₹{slabResult.estimatedSandCost.toLocaleString()}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">Cement 53 Grade</span>
                        <span className="font-bold text-white text-xs">{slabResult.cementBags} Bags</span>
                        <span className="text-slate-400 text-[9px] block">~₹{slabResult.estimatedCementCost.toLocaleString()}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">20mm Aggregates</span>
                        <span className="font-bold text-white text-xs">{slabResult.aggregatesTons} Tons</span>
                        <span className="text-slate-400 text-[9px] block">~₹{slabResult.estimatedAggregatesCost.toLocaleString()}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">16T Tipper Trucks</span>
                        <span className="font-bold text-brand-orange-400 text-xs">
                          {slabResult.tipperTrucksNeeded} Tipper{slabResult.tipperTrucksNeeded > 1 ? "s" : ""}
                        </span>
                        <span className="text-slate-400 text-[9px] block">Hydraulic Unload</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 italic">
                      *IS:456 RCC M20 (1:1.5:3). Transport freight is confirmed by dispatch based on site location.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => handleAddSlabToCart()}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-white bg-brand-orange-500 hover:bg-brand-orange-600 transition-colors shadow-lg active:scale-98"
                      >
                        {slabAddedSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Added to Cart! Open Drawer</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Add Calculated Materials to Cart</span>
                          </>
                        )}
                      </button>

                      <div className="flex gap-1.5">
                        <a
                          href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=Hello%20Jayam%20Materials,%20I%20used%20your%20calculator%20for%20a%20${slabResult.slabAreaSqFt}%20sqft%20slab%20and%20need%20${slabResult.sandTons}%20tons%20${slabSandType === "river-sand" ? "River%20Sand" : "M-Sand"},%20${slabResult.cementBags}%20bags%20cement,%20and%20${slabResult.aggregatesTons}%20tons%20aggregates.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-[11px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Order</span>
                        </a>

                        <a
                          href={BRAND_INFO.telUrl}
                          className="flex items-center justify-center px-3 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors text-[11px]"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PLASTERING CALCULATOR FORM */}
              {calcMode === "plaster" && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                      Wall Area Presets
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[400, 800, 1200, 2000].map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setPlasterArea(area)}
                          className={`py-1 text-center font-semibold rounded-lg border text-[11px] transition-all ${
                            plasterArea === area
                              ? "bg-brand-orange-50 border-brand-orange-500 text-brand-orange-700 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {area} sqft
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5 shadow-sm">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Wall Surface Area</span>
                        <span className="font-bold text-brand-orange-600">{plasterArea} sq.ft</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="5000"
                        step="50"
                        value={plasterArea}
                        onChange={(e) => setPlasterArea(parseInt(e.target.value) || 100)}
                        className="w-full accent-brand-orange-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-700">Plaster Thickness</span>
                        <span className="font-bold text-slate-900">{plasterThickness} mm</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPlasterThickness(12)}
                          className={`py-1 text-center font-medium rounded-lg border text-[11px] ${
                            plasterThickness === 12
                              ? "bg-brand-charcoal text-white border-brand-charcoal"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          12mm (Internal Walls)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlasterThickness(15)}
                          className={`py-1 text-center font-medium rounded-lg border text-[11px] ${
                            plasterThickness === 15
                              ? "bg-brand-charcoal text-white border-brand-charcoal"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }`}
                        >
                          15mm (External Walls)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Plaster Output Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-brand-charcoal text-white p-3.5 rounded-2xl shadow-md space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Plastering Area</span>
                        <span className="font-extrabold text-base text-brand-orange-400">
                          {plasterResult.wallAreaSqFt.toLocaleString()} sq.ft
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Material Total</span>
                        <span className="font-extrabold text-base text-emerald-400">
                          ₹{plasterResult.estimatedCost.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">P-Sand (Plaster Sand)</span>
                        <span className="font-bold text-white text-xs">{plasterResult.sandTons} Tons</span>
                        <span className="text-slate-400 text-[9px] block">~₹{Math.round(plasterResult.sandTons * 1350).toLocaleString()}</span>
                      </div>

                      <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                        <span className="text-slate-400 text-[10px] block">Cement 53 Grade</span>
                        <span className="font-bold text-white text-xs">{plasterResult.cementBags} Bags</span>
                        <span className="text-slate-400 text-[9px] block">~₹{Math.round(plasterResult.cementBags * 395).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <button
                        onClick={() => handleAddPlasterToCart()}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-white bg-brand-orange-500 hover:bg-brand-orange-600 transition-colors shadow-lg active:scale-98"
                      >
                        {plasterAddedSuccess ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Added to Cart! Open Drawer</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Add Plastering Materials to Cart</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`https://wa.me/91${BRAND_INFO.whatsappNumber}?text=Hello%20Jayam%20Materials,%20I%20need%20${plasterResult.sandTons}%20tons%20P-Sand%20and%20${plasterResult.cementBags}%20bags%20cement%20for%20${plasterResult.wallAreaSqFt}%20sqft%20plastering.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1 py-2 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-[11px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Book Plastering Materials on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
