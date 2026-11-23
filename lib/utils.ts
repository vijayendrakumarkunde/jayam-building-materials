import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { BRAND_INFO } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds standard NPCI UPI Intent Link for mobile UPI apps (GPay, PhonePe, Paytm, BHIM)
 */
export function buildUpiIntentUrl(amount: number, orderRef: string): string {
  const vpa = BRAND_INFO.upiId;
  const name = encodeURIComponent(BRAND_INFO.merchantName);
  const note = encodeURIComponent(`Order ${orderRef}`);
  return `upi://pay?pa=${vpa}&pn=${name}&am=${amount}&cu=INR&tn=${note}`;
}

/**
 * Builds dynamic QR code URL for desktop/tablet scanning
 */
export function buildUpiQrCodeUrl(amount: number, orderRef: string): string {
  const upiUrl = buildUpiIntentUrl(amount, orderRef);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(upiUrl)}`;
}

/**
 * Builds comprehensive, formatted WhatsApp notification for the business owner (9505609865)
 */
export function buildWhatsAppOrderMessage(order: {
  orderReference: string;
  customerName: string;
  customerPhone: string;
  alternatePhone?: string;
  deliveryAddress: string;
  landmark?: string;
  cityOrArea?: string;
  roadAccess?: string;
  preferredDate?: string;
  specialInstructions?: string;
  items: Array<{ product: { name: string; unit: string; price: number }; quantity: number }>;
  subtotal: number;
  paymentMethod?: string;
  paymentStatus?: string;
  utrNumber?: string;
}): string {
  const materialsList = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}*\n   Qty: ${item.quantity} ${item.product.unit} (₹${(item.product.price * item.quantity).toLocaleString("en-IN")})`
    )
    .join("\n");

  const message =
    `🚨 *NEW ORDER RECEIVED - JAYAM BUILDING MATERIALS*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `📦 *Order ID*: *${order.orderReference}*\n` +
    `👤 *Customer*: ${order.customerName}\n` +
    `📞 *Phone*: ${order.customerPhone}` + (order.alternatePhone ? ` (Alt: ${order.alternatePhone})` : ``) + `\n` +
    `📍 *Site Address*: ${order.deliveryAddress}\n` +
    (order.landmark ? `🏛️ *Landmark*: ${order.landmark}\n` : ``) +
    `🛣️ *Road Access*: ${order.roadAccess || "10-Wheeler Tipper"}\n` +
    `🕒 *Preferred Time*: ${order.preferredDate || "Earliest Slot"}\n` +
    (order.specialInstructions ? `💬 *Notes*: ${order.specialInstructions}\n` : ``) +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🧱 *MATERIALS BOOKED*:\n` +
    `${materialsList}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `💰 *Estimated Total*: *₹${order.subtotal.toLocaleString("en-IN")}*\n` +
    `💳 *Payment Choice*: *${order.paymentMethod || "Pay on Site Delivery"}*\n` +
    (order.utrNumber ? `🧾 *UPI Transaction/UTR*: ${order.utrNumber}\n` : ``) +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `Please confirm tipper vehicle dispatch slot and transport fees.`;

  return encodeURIComponent(message);
}
