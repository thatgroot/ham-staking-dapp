import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "custom-radial":
          "radial-gradient(circle, transparent, rgba(62, 141, 227, 0.1))",
      },
      dropShadow: {
        drop: "0 1px 1px #71FF7E",
        "button-drop": "0 4px 8px #3E8DE3",
        card: "0 4px 15px rgba(62, 141, 227, 0.4)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
