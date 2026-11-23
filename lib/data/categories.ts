import { Category } from "../types";

export const CATEGORIES_DATA: Category[] = [
  // ==================== PRIMARY 6 CARDS (EXACT BUILDERS9 LAYOUT) ====================
  {
    id: "cat-cement",
    name: "Cement",
    slug: "cement",
    description: "OPC 53 Grade, PPC & PSC from Ultratech, JSW, ACC, Ramco, Bharathi & Sagar.",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
    itemCount: 62,
    bgColor: "#F0F3F9", // Soft Lavender Blue
    featured: true,
  },
  {
    id: "cat-steel",
    name: "TMT Steel Bars",
    slug: "steel",
    description: "Primary Fe 550D & Fe 500D high-ductility ribbed reinforcement TMT rebars.",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80",
    itemCount: 46,
    bgColor: "#FDF1EB", // Soft Peach
    featured: true,
  },
  {
    id: "cat-bricks",
    name: "Bricks & Blocks",
    slug: "bricks",
    description: "First-class red clay chamber bricks, AAC light blocks, and concrete solid blocks.",
    imageUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    itemCount: 40,
    bgColor: "#F4F3F5", // Soft Warm Grey
    featured: true,
  },
  {
    id: "cat-sand",
    name: "Sand & Aggregates",
    slug: "sand",
    description: "Triple-washed river sand, Kattubadi sand, VSI M-sand, P-sand, and blue metal stones.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: 14,
    bgColor: "#FAF0DC", // Warm Golden Sand
    featured: true,
  },
  {
    id: "cat-tiles",
    name: "Tiles",
    slug: "tiles",
    description: "Double-charged vitrified floor tiles, ceramic wall tiles, parking & outdoor paver tiles.",
    imageUrl: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80",
    itemCount: 434,
    bgColor: "#EAF3EE", // Soft Sage Mint
    featured: true,
  },
  {
    id: "cat-paints",
    name: "Paints & Finishes",
    slug: "paints",
    description: "Interior emulsions, exterior weather-proof coats, primers, and wall putty buckets.",
    imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
    itemCount: 739,
    bgColor: "#EBF1FB", // Soft Periwinkle
    featured: true,
  },

  // ==================== "MORE CATEGORIES" SECTION ====================
  {
    id: "cat-plumbing",
    name: "Plumbing-Sanitary",
    slug: "plumbing",
    description: "CPVC & UPVC pipes, drainage fittings, water tanks, sanitaryware, and taps.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
    itemCount: 562,
    bgColor: "#E8F4F8",
    isMoreCategory: true,
  },
  {
    id: "cat-stones",
    name: "Stones & Foundation",
    slug: "stones",
    description: "Quarried grey granite rubble boulder stones for basement masonry & retaining walls.",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
    itemCount: 18,
    bgColor: "#F7EFE8",
    isMoreCategory: true,
  },
  {
    id: "cat-red-soil",
    name: "Red Soil & Landscaping",
    slug: "red-soil",
    description: "Natural fertile red soil, excavated site filling earth, and garden potting mix.",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=400&q=80",
    itemCount: 12,
    bgColor: "#FDF0ED",
    isMoreCategory: true,
  },
  {
    id: "cat-electricals",
    name: "Electricals & Lighting",
    slug: "electricals",
    description: "Concealed wiring cables, modular switches, MCBs, distribution boards & conduits.",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80",
    itemCount: 320,
    bgColor: "#FFF8E7",
    isMoreCategory: true,
  },
];
