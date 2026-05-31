/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Tech Color System
        tech: {
          "deep-space": "#060b14",
          "deep-navy": "#0a1628",
          "mid-navy": "#0c1a32",
          "dark-card": "#0f1d3a",
          "aurora": "#38bdf8",
          "aurora-glow": "rgba(56,189,248,0.25)",
          "energy": "#22d3ee",
          "energy-glow": "rgba(34,211,238,0.25)",
          "lithium": "#4ade80",
          "lithium-glow": "rgba(74,222,128,0.25)",
          "wind": "#a78bfa",
          "wind-glow": "rgba(167,139,250,0.25)",
          "danger-orange": "#fb923c",
          "danger-red": "#f87171",
          "warning": "#fbbf24",
          "success": "#34d399",
          "silver": "#e2e8f0",
          "silver-muted": "#94a3b8",
          "glass": "rgba(15,29,58,0.6)",
          "glass-border": "rgba(56,189,248,0.12)",
          "glass-border-hover": "rgba(56,189,248,0.3)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-xl, 1.25rem)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(56,189,248,0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(56,189,248,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [],
}
