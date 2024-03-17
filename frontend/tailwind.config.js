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
        label: "#5d5f61",
        // blue: "#1790FF",
        // gray: "#425C6F",
        "michi-blue": {
          100: "#8EE3FB",
        },
      },
      backgroundColor: {
        background: "#222222",
        "secondary-background": "black",
        "placeholder-background": "#425C6F",
        dark: "#2D2D37",
        success: "#27d564",
      },
      stroke: {
        "trading-protocol": "linear-gradient(90deg, #3360FF 0%, #20BDFF 100%)",
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".custom-drop-shadow": {
          filter: "drop-shadow(rgb(53, 205, 248) 0px 0px 8px)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#F7BA1E",
          ".btn-primary": {
            color: "#2D2D37",
          },
          ".btn": {
            border: "none",
            fontWeight: 700,
          },
          ".btn-success": {
            backgroundColor: "#27d564",
          },

          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          "base-100": "#ffffff",

          "--rounded-box": "1rem",
          "--rounded-btn": "16px",
          "--rounded-badge": "1.9rem",
          "—-animation-btn": "0.25s",
          "—-animation-input": "0.2s",
          "—-btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "—-tab-radius": "0.5rem",
        },
      },
    ],
  },
};
