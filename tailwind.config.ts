const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Existing colors
        primary: "#C9002B", // Moroccan Red
        accent: "#006E90", // Teal Blue
        neutral: "#F8F4E9", // Sand White
        text: "#333333", // Default Text Color
        secondary: "#0076A6", // Gradient complement

        // New Moroccan-inspired colors
        morocco: {
          red: "#C73E3A",
          orange: "#E6654D",
          terra: "#BA6D57",
          sand: "#E6B89C",
          blue: {
            light: "#0076A6",
            DEFAULT: "#006E90",
            dark: "#005875",
          },
          green: {
            light: "#7DA87B",
            DEFAULT: "#6B8F71",
            dark: "#5A7A5E",
          },
          gold: "#D4AF37",
          earth: {
            light: "#D2B48C",
            DEFAULT: "#BFA084",
            dark: "#8B7355",
          },
        },
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      boxShadow: {
        "lg-custom":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        moroccan:
          "0 4px 6px -1px rgba(186, 109, 87, 0.1), 0 2px 4px -1px rgba(186, 109, 87, 0.06)",
      },
      backgroundImage: {
        "header-gradient":
          "linear-gradient(to right, #C9002B, #006E90, #0076A6)",
        "morocco-gradient":
          "linear-gradient(to right, #C73E3A, #BA6D57, #E6B89C)",
        "desert-gradient": "linear-gradient(to bottom, #F8F4E9, #FFFFFF)",
        "pattern-overlay": "url('/pattern-overlay.png')", // Add a subtle pattern overlay

        // Carpet Background
        "carpet-bg": "url('/carpet-bg.jpg')",
      },
      borderRadius: {
        moroccan: "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      // Custom spacing utilities for Moroccan-inspired layouts
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [
    // Add any plugins you need
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
};
