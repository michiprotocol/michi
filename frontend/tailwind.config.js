/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F7BA1E",
        info: "#FAFAFA",
        secondary: "#A3A5D3",
        action: "#FF852C",
        "gradient-button": "#222222",
        blue: "#1790FF",
        gray: "#425C6F",
      },
      backgroundColor: {
        background: "#222222",
        "secondary-background": "#282828",
        "placeholder-background": "#425C6F",
        dark: "#2D2D37",
      },
    },
  },
  plugins: [require("daisyui")],
};
