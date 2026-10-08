import type { Config } from "tailwindcss";

/**
 * Tailwind's default opacity scale skips single digits, so `/8` or `/85` would
 * not resolve. The design uses fine-grained translucency for glass and border
 * work, so the whole 0–100 range is exposed here. JIT only emits the values
 * that actually appear in the source.
 */
const opacity = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
);

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      opacity,
      colors: {
        night: {
          900: "#0b0713",
          800: "#150d24",
          700: "#1f1436",
          600: "#2c1c4a",
        },
        cream: {
          50: "#fffdf9",
          100: "#fdf7ee",
          200: "#f8eddd",
          300: "#f0dfc7",
          400: "#e4ccab",
        },
        ember: {
          300: "#ffc48c",
          400: "#ffa457",
          500: "#ff8a3d",
          600: "#f26b1d",
        },
        berry: {
          400: "#ff7a9c",
          500: "#f4527a",
          600: "#d63a62",
        },
        grape: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7048e0",
        },
        mint: {
          400: "#6ee7b7",
          500: "#34d399",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(76, 29, 149, 0.35)",
        lift: "0 28px 70px -26px rgba(76, 29, 149, 0.45)",
        glow: "0 0 60px -10px rgba(255, 138, 61, 0.55)",
        paper: "0 1px 0 rgba(255,255,255,0.7) inset, 0 24px 60px -30px rgba(120, 53, 15, 0.5)",
      },
      backgroundImage: {
        "cream-sheen":
          "radial-gradient(120% 100% at 50% 0%, #fffdf9 0%, #fdf3e4 45%, #f6e5cf 100%)",
        "night-sheen":
          "radial-gradient(100% 80% at 50% 0%, #2c1c4a 0%, #150d24 55%, #0b0713 100%)",
        gold: "linear-gradient(120deg,#ffd9a8 0%,#ffa457 35%,#f4527a 70%,#a78bfa 100%)",
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(1.2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        twinkle: {
          "0%,100%": { opacity: "0.25", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-1.6deg)" },
          "50%": { transform: "rotate(1.6deg)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.85)", opacity: "0.8" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
        wiggle: "wiggle 2.6s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
        pulseRing: "pulseRing 2.6s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;