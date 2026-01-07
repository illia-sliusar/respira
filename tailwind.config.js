/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary - Black for main actions
        primary: {
          DEFAULT: "#000000",
          light: "#333333",
          dark: "#000000",
        },
        // Accent - Green for CTAs and highlights
        accent: {
          DEFAULT: "#00D26B",
          light: "#33E18C",
          dark: "#00B85C",
        },
        // Emerald - Health/Safe status colors
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Secondary
        secondary: {
          DEFAULT: "#6B7280",
          light: "#9CA3AF",
          dark: "#4B5563",
        },
        // Status
        success: {
          DEFAULT: "#00D26B",
          light: "#33E18C",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#F87171",
        },
        // Semantic colors
        background: "#FFFFFF",
        surface: "#F9FAFB",
        "surface-secondary": "#F3F4F6",
        "surface-dark": "#18181b",
        text: {
          DEFAULT: "#000000",
          secondary: "#6B7280",
          muted: "#9CA3AF",
          placeholder: "#D1D5DB",
        },
        border: "#E5E7EB",
        divider: "#F3F4F6",
        overlay: "rgba(0, 0, 0, 0.5)",
        input: {
          DEFAULT: "#F9FAFB",
          border: "#E5E7EB",
          focus: "#000000",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        "3xl": "32px",
        full: "9999px",
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["28px", { lineHeight: "36px" }],
        "4xl": ["32px", { lineHeight: "40px" }],
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
    },
  },
  plugins: [],
};
