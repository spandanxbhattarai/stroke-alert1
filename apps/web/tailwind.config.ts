import type { Config } from "tailwindcss";

/**
 * SIGNAL — Swiss / International Typographic Style tokens.
 * See REDESIGN_PLAN.md. Monochrome + one signal red. Zero radius. Hairline rules.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--paper)",
          2: "var(--paper-2)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        rule: "var(--rule)",
        signal: {
          DEFAULT: "var(--signal)",
          ink: "var(--signal-ink)",
        },
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }]
        micro: ["0.625rem", { lineHeight: "1.2", letterSpacing: "0.16em" }],
        label: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.14em" }],
        small: ["0.8125rem", { lineHeight: "1.45" }],
        body: ["0.9375rem", { lineHeight: "1.55" }],
        "body-l": ["1.0625rem", { lineHeight: "1.55" }],
        h3: ["1.0625rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],
        "display-m": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-l": ["clamp(2.25rem, 6vw, 4.5rem)", { lineHeight: "0.92", letterSpacing: "-0.035em" }],
        "display-xl": ["clamp(3.25rem, 11vw, 9rem)", { lineHeight: "0.86", letterSpacing: "-0.045em" }],
      },
      spacing: {
        gutter: "1.5rem",
        inset: "clamp(1.25rem, 4vw, 4rem)",
      },
      maxWidth: {
        grid: "1440px",
      },
      borderRadius: {
        // Swiss: everything is square. `full` survives for map markers and pulse dots.
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      transitionTimingFunction: {
        swiss: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
