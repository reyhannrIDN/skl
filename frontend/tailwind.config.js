/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
      },
      borderRadius: {
        xl: "24px",
        lg: "20px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
        hover: "0 20px 60px rgba(0,0,0,0.12)",
        glow: "0 0 20px rgba(108,99,255,0.5)",
        "glow-purple": "0 0 20px rgba(108,99,255,0.4)",
        "glow-cyan": "0 0 20px rgba(0,217,255,0.4)",
        premium: "0 0 0 1px rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.2), 0 24px 48px rgba(0,0,0,0.15)",
        "premium-hover": "0 0 0 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.2), 0 16px 32px rgba(0,0,0,0.25), 0 48px 80px rgba(0,0,0,0.2)",
        "card-glow": "0 8px 40px rgba(108,99,255,0.08), 0 0 0 1px rgba(108,99,255,0.06)",
        "card-glow-hover": "0 16px 64px rgba(108,99,255,0.15), 0 0 0 1px rgba(108,99,255,0.12)",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
