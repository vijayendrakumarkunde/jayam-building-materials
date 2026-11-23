import { Category } from "../types";

export const CATEGORIES_DATA: Category[] = [
  // ==================== PRIMARY 6 CARDS (BUILDERS9 PASTEL CARDS) ====================
  {
    id: "cat-sand",
    name: "Sand & Aggregates",
    slug: "sand",
    description: "Triple-washed river sand, Kattubadi sand, VSI M-sand, P-sand, and 20mm/40mm blue metal stones.",
    imageUrl: "/images/products/sand-mound.jpg",
    itemCount: 9,
    bgColor: "#FAF0DC", // Warm Golden Sand
    featured: true,
  },
  {
    id: "cat-cement",
    name: "Cement",
    slug: "cement",
    description: "OPC 53 Grade, PPC & PSC from Ultratech, JSW, ACC, Ramco & Bharathi.",
    imageUrl: "/images/products/cement-brands.jpg",
    itemCount: 5,
    bgColor: "#F0F3F9", // Soft Lavender Blue
    featured: true,
  },
  {
    id: "cat-steel",
    name: "TMT Steel Bars",
    slug: "steel",
    description: "Primary Fe 550D & Fe 500D high-ductility ribbed reinforcement TMT rebars.",
    imageUrl: "/images/products/tmt-steel-bundle.jpg",
    itemCount: 4,
    bgColor: "#FDF1EB", // Soft Peach
    featured: true,
  },
  {
    id: "cat-bricks",
    name: "Bricks & Blocks",
    slug: "bricks",
    description: "First-class red clay chamber bricks, AAC light blocks, and concrete solid blocks.",
    imageUrl: "/images/products/bricks-blocks.jpg",
    itemCount: 3,
    bgColor: "#F4F3F5", // Soft Warm Grey
    featured: true,
  },
  {
    id: "cat-stones",
    name: "Stones & Foundation",
    slug: "stones",
    description: "Quarried grey granite rubble boulder stones for basement masonry & retaining walls.",
    imageUrl: "/images/products/granite-rubble.jpg",
    itemCount: 1,
    bgColor: "#F7EFE8", // Soft Granite Warm
    featured: true,
  },
  {
    id: "cat-red-soil",
    name: "Red Soil & Landscaping",
    slug: "red-soil",
    description: "Natural fertile red soil, excavated site filling earth, and garden potting mix.",
    imageUrl: "/images/products/red-soil.jpg",
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
    imageUrl: "/images/products/polycab-wire.jpg",
    itemCount: 2,
    bgColor: "#FFF8E7",
    isMoreCategory: true,
  },
];
