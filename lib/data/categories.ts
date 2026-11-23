import { Category } from "../types";

export const CATEGORIES_DATA: Category[] = [
  // ==================== PRIMARY 6 CARDS (BUILDERS9 PASTEL CARDS) ====================
  {
    id: "cat-sand",
    name: "Sand & Aggregates",
    slug: "sand",
    description: "Triple-washed river sand, Kattubadi sand, VSI M-sand, P-sand, and 20mm/40mm blue metal stones.",
    imageUrl: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    itemCount: 9,
    bgColor: "#FAF0DC", // Warm Golden Sand
    featured: true,
  },
  {
    id: "cat-cement",
    name: "Cement",
    slug: "cement",
    description: "OPC 53 Grade, PPC & PSC from Ultratech, JSW, ACC, Ramco & Bharathi.",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    itemCount: 5,
    bgColor: "#F0F3F9", // Soft Lavender Blue
    featured: true,
  },
  {
    id: "cat-steel",
    name: "TMT Steel Bars",
    slug: "steel",
    description: "Primary Fe 550D & Fe 500D high-ductility ribbed reinforcement TMT rebars.",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    itemCount: 4,
    bgColor: "#FDF1EB", // Soft Peach
    featured: true,
  },
  {
    id: "cat-bricks",
    name: "Bricks & Blocks",
    slug: "bricks",
    description: "First-class red clay chamber bricks, AAC light blocks, and concrete solid blocks.",
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    itemCount: 3,
    bgColor: "#F4F3F5", // Soft Warm Grey
    featured: true,
  },
  {
    id: "cat-stones",
    name: "Stones & Foundation",
    slug: "stones",
    description: "Quarried grey granite rubble boulder stones for basement masonry & retaining walls.",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
    itemCount: 1,
    bgColor: "#F7EFE8", // Soft Granite Warm
    featured: true,
  },
  {
    id: "cat-red-soil",
    name: "Red Soil & Landscaping",
    slug: "red-soil",
    description: "Natural fertile red soil, excavated site filling earth, and garden potting mix.",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=800&q=80",
    itemCount: 1,
    bgColor: "#FDF0ED", // Soft Red Clay
    featured: true,
  },

  // ==================== "MORE CATEGORIES" SECTION ====================
  {
    id: "cat-electricals",
    name: "Electricals & Lighting",
    slug: "electricals",
    description: "Concealed wiring cables, modular switches, MCBs, distribution boards & conduits.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    itemCount: 2,
    bgColor: "#FFF8E7",
    isMoreCategory: true,
  },
];
