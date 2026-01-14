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
                // C0RVEX Stealth Tech Palette
                bg: {
                    DEFAULT: "#0D0D0D", // Deep Charcoal
                    surface: "#1A1A1A", // Cards/Sidebars
                },
                primary: {
                    DEFAULT: "#A0E9FF", // Icy Blue (Neon)
                    hover: "#7DD3FF",
                    muted: "#4DB8E8",
                },
                text: {
                    main: "#FFFFFF", // Branco Puro
                    muted: "#888888", // Cinza Metálico
                    dark: "#666666",
                },
                border: {
                    DEFAULT: "#333333", // Sutil
                    light: "#444444",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            backdropBlur: {
                glass: "16px",
            },
            boxShadow: {
                glass: "0 8px 32px 0 rgba(160, 233, 255, 0.1)",
                glow: "0 0 20px rgba(160, 233, 255, 0.3)",
            },
            animation: {
                "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                glow: {
                    "0%": { boxShadow: "0 0 5px rgba(160, 233, 255, 0.2)" },
                    "100%": { boxShadow: "0 0 20px rgba(160, 233, 255, 0.6)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
