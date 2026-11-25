import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BRAND_INFO } from "@/lib/constants";
import { CartProvider } from "@/lib/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: `${BRAND_INFO.name} | Premium Building Materials Marketplace`,
  description: `${BRAND_INFO.tagline} Direct-from-source River Sand, VSI M-Sand, 53 Grade Cement, Fe 550D TMT Steel, and Crushed Aggregates. Accurate weighbridge slips and prompt site tipper delivery.`,
  icons: {
    icon: "/images/logo-icon.png",
    shortcut: "/images/logo-icon.png",
    apple: "/images/logo-icon.png",
  },
  keywords: [
    "Jayam Building Materials",
    "River Sand",
    "M-Sand",
    "Plastering Sand",
    "Cement 53 Grade",
    "TMT Steel 550D",
    "Crushed Blue Metal Aggregates",
    "Building Materials Wholesale",
    "Tipper Sand Delivery",
  ],
  authors: [{ name: BRAND_INFO.name }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-brand-charcoal antialiased">
        <CartProvider>
          {children}
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
