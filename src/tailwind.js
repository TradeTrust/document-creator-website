const plugin = require("tailwindcss/plugin");

module.exports = {
  theme: {
    fontFamily: {
      display: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      body: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    minWidth: {
      "0": "0",
      xs: "18rem",
    },
    extend: {
      spacing: {
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      colors: {
        primary: {
          default: "#FF9220",
        },
        secondary: {
          default: "#E6F5FA",
        },
      },
    },
    colors: {
      lightgrey: {
        lighter: "#fafafa",
        default: "#eeeeee",
        dark: "#89969F",
      },
      grey: {
        lighter: "#dddddd",
        default: "#a0aec0",
        dark: "#4F4F4F",
      },
      blue: {
        lighter: "#e6f5fa",
        default: "#0099CC",
        dark: "#2b6cb0",
      },
      orange: {
        lighter: "#fbd38d",
        default: "#FF9220",
        dark: "#ed8936",
      },
      green: {
        lighter: "#68d391",
        default: "#48bb78",
        dark: "#38a169",
        darker: "#001f29",
      },
      teal: {
        lighter: "#e5f9f8",
        default: "#00CBBC",
      },
      pink: {
        default: "#ffe8e8",
      },
      red: {
        lighter: "#FFF4F4",
        default: "#FF2020",
        dark: "#c53030",
      },
      white: {
        default: "#ffffff",
      },
      black: {
        default: "#000000",
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [
    plugin(function ({ addBase, config }) {
      addBase({
        h1: { fontWeight: config("theme.fontWeight.bold") },
        h2: { fontWeight: config("theme.fontWeight.bold") },
        h3: { fontWeight: config("theme.fontWeight.bold") },
        h4: { fontWeight: config("theme.fontWeight.bold") },
        h5: { fontWeight: config("theme.fontWeight.bold") },
        h6: { fontWeight: config("theme.fontWeight.bold") },
      });
    }),
  ],
};
