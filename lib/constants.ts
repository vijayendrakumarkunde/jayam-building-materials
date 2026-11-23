export const BRAND_INFO = {
  name: "JAYAM BUILDING MATERIALS",
  shortName: "Jayam Materials",
  tagline: "Everything You Build, Starts With Us.",
  phone: "9505609865",
  phoneFormatted: "+91 95056 09865",
  whatsappNumber: "9505609865",
  whatsappUrl: "https://wa.me/919505609865",
  telUrl: "tel:+919505609865",
  email: "orders@jayambuildingmaterials.com",
  operatingHours: "Mon - Sat: 6:00 AM - 9:00 PM | Sunday: 7:00 AM - 2:00 PM",
  address: "Plot No. 42, Outer Ring Road Logistics Junction, Industrial Hub",
  deliveryNotice: "Delivery charges are calculated based on your site location, accessibility, and vehicle type (Tipper / Lorry / Small Truck). Our dispatch coordinator will contact you immediately after booking to confirm final transport details.",
  // Direct UPI Configuration (Can be changed anytime)
  upiId: "9505609865@axl",
  alternateUpiId: "9505609865@ibl",
  merchantName: "JAYAM BUILDING MATERIALS",
  advanceTokenAmount: 2000, // Token amount to confirm & dispatch tipper truck
};

export const INITIAL_CATEGORIES = [
  { id: "river-sand", name: "River Sand", slug: "river-sand", icon: "Waves" },
  { id: "m-sand", name: "M-Sand", slug: "m-sand", icon: "Mountain" },
  { id: "plastering-sand", name: "Plastering Sand", slug: "plastering-sand", icon: "Layers" },
  { id: "cement", name: "Cement", slug: "cement", icon: "Box" },
  { id: "bricks", name: "Bricks", slug: "bricks", icon: "Grid" },
  { id: "steel", name: "Steel", slug: "steel", icon: "Shield" },
  { id: "gravel", name: "Gravel", slug: "gravel", icon: "CircleDot" },
  { id: "aggregates", name: "Aggregates", slug: "aggregates", icon: "Shapes" },
  { id: "stones", name: "Stones", slug: "stones", icon: "Gem" },
  { id: "other-materials", name: "Other Building Materials", slug: "other-materials", icon: "PackagePlus" },
] as const;

export const MEASUREMENT_UNITS = [
  "Ton",
  "Truck",
  "Bag",
  "Piece",
  "Cubic Feet (CFT)",
] as const;
