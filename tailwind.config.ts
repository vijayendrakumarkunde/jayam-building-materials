import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            DEFAULT: "#F47B20", // Construction Orange accent
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            300: "#FDBA74",
            400: "#FB923C",
            500: "#F47B20",
            600: "#DC630D",
            700: "#B44B08",
            800: "#8C3807",
            900: "#692B07",
          },
          navy: {
            DEFAULT: "#14243A", // Deep Navy secondary accent
            50: "#F0F4F8",
            100: "#D9E2EC",
            200: "#BCCCDC",
            300: "#9FB3C8",
            400: "#829AB1",
            500: "#627D98",
            600: "#486581",
            700: "#334E68",
            800: "#243B53",
            900: "#14243A",
            950: "#0B1522",
          },
          charcoal: {
            DEFAULT: "#20252D", // Primary Charcoal text
            50: "#F8F9FA",
            100: "#F1F3F5",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#2B313A",
            900: "#20252D",
            950: "#13171C",
          },
          grey: {
            DEFAULT: "#F5F6F8", // Soft Grey secondary background
            50: "#FAFAFA",
            100: "#F5F6F8",
            200: "#ECEEF2",
            300: "#DFE2E6",
            400: "#CED3D9",
          },
          green: {
            DEFAULT: "#159B68", // Professional Green success accent
            50: "#E8F7F0",
            100: "#D1EFE1",
            500: "#159B68",
            600: "#108055",
            700: "#0C6543",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
