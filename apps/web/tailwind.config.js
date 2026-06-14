/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        muted: "hsl(var(--muted))"
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.5rem"
      },
      boxShadow: {
        "red-glow": "0 0 0 1px rgba(205,0,0,0.25), 0 12px 40px rgba(205,0,0,0.2)",
        "card": "0 10px 30px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};
