import { useState, useEffect } from "react";
import { BRAND_INFO } from "../constants";

export interface BrandSettings {
  name: string;
  shortName: string;
  tagline: string;
  phone: string;
  phoneFormatted: string;
  whatsappNumber: string;
  whatsappUrl: string;
  telUrl: string;
  email: string;
  operatingHours: string;
  address: string;
  dumpingYardMapsUrl: string;
  deliveryNotice: string;
  upiId: string;
  alternateUpiId: string;
  merchantName: string;
}

export const SETTINGS_STORAGE_KEY = "jayam_custom_settings";
export const SETTINGS_UPDATED_EVENT = "jayam_settings_updated";

/**
 * Normalizes and formats raw settings input with safe fallbacks to BRAND_INFO
 */
export function computeBrandSettings(raw: Partial<Record<string, any>> = {}): BrandSettings {
  const name = raw.businessName || raw.name || BRAND_INFO.name;
  const shortName = raw.shortName || BRAND_INFO.shortName;
  const tagline = raw.tagline || BRAND_INFO.tagline;
  const phone = raw.phone || raw.businessPhone || BRAND_INFO.phone;
  const rawWhatsapp = raw.whatsapp || raw.whatsappNumber || raw.businessPhone || phone || BRAND_INFO.whatsappNumber;
  const email = raw.email || BRAND_INFO.email;
  const operatingHours = raw.operatingHours || raw.operating_hours || BRAND_INFO.operatingHours;
  const address = raw.address || raw.physicalAddress || raw.physical_address || BRAND_INFO.address;
  const dumpingYardMapsUrl = raw.dumpingYardMapsUrl || raw.dumping_yard_maps_url || BRAND_INFO.dumpingYardMapsUrl;
  const deliveryNotice = raw.deliveryNotice || raw.delivery_notice || BRAND_INFO.deliveryNotice;
  const upiId = raw.upiId || raw.upi_id || BRAND_INFO.upiId;
  const alternateUpiId = raw.alternateUpiId || raw.alternate_upi_id || BRAND_INFO.alternateUpiId;
  const merchantName = raw.merchantName || raw.merchant_name || BRAND_INFO.merchantName;

  // Clean phone and whatsapp numbers for URLs and display
  const cleanPhone = String(phone).replace(/\D/g, "");
  const cleanWhatsapp = String(rawWhatsapp).replace(/\D/g, "");

  // Format phone number nicely (e.g. +91 95056 09865)
  let phoneFormatted = String(phone);
  if (cleanPhone.length === 10) {
    phoneFormatted = `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    const core = cleanPhone.slice(2);
    phoneFormatted = `+91 ${core.slice(0, 5)} ${core.slice(5)}`;
  }

  const purePhone10 = cleanPhone.length === 10 ? cleanPhone : cleanPhone.replace(/^91/, "");
  const pureWhatsapp10 = cleanWhatsapp.length === 10 ? cleanWhatsapp : cleanWhatsapp.replace(/^91/, "");

  return {
    name,
    shortName,
    tagline,
    phone,
    phoneFormatted,
    whatsappNumber: pureWhatsapp10 || BRAND_INFO.whatsappNumber,
    whatsappUrl: `https://wa.me/91${pureWhatsapp10 || BRAND_INFO.whatsappNumber}`,
    telUrl: `tel:+91${purePhone10 || BRAND_INFO.phone}`,
    email,
    operatingHours,
    address,
    dumpingYardMapsUrl,
    deliveryNotice,
    upiId,
    alternateUpiId,
    merchantName,
  };
}

/**
 * Read currently saved settings from localStorage, or fallback to BRAND_INFO
 */
export function getStoredSettings(): BrandSettings {
  if (typeof window === "undefined") {
    return computeBrandSettings(BRAND_INFO);
  }
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return computeBrandSettings(BRAND_INFO);
    const parsed = JSON.parse(raw);
    return computeBrandSettings(parsed);
  } catch (e) {
    return computeBrandSettings(BRAND_INFO);
  }
}

/**
 * Save settings to localStorage and trigger instant cross-component re-render
 */
export function saveStoredSettings(data: Partial<Record<string, any>>) {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredSettings();
    const merged = computeBrandSettings({ ...current, ...data });
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT));
  } catch (e) {
    console.error("Failed to save stored settings:", e);
  }
}

/**
 * Reactive React hook for any component to access dynamic website settings
 * (Yard & depot address, operating hours, phone, whatsapp, UPI IDs, etc.)
 */
export function useBrandSettings(): BrandSettings {
  // Initial state uses BRAND_INFO to ensure SSR hydration matches identically
  const [settings, setSettings] = useState<BrandSettings>(() => computeBrandSettings(BRAND_INFO));

  useEffect(() => {
    // 1. Immediately apply cached localStorage settings if available
    const local = getStoredSettings();
    setSettings(local);

    // 2. Fetch fresh live settings from Supabase database via /api/settings
    let isMounted = true;
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch settings");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (data && data.settings) {
          const fresh = computeBrandSettings(data.settings);
          setSettings(fresh);
          try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(fresh));
          } catch {}
        }
      })
      .catch((err) => {
        console.warn("Could not fetch remote settings from API, using cached:", err);
      });

    // 3. Listen to local updates from admin panel or other tabs
    const handleUpdate = () => {
      setSettings(getStoredSettings());
    };

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return settings;
}
