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
    extend: {
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
        default: "#f6ad55",
        dark: "#ed8936",
      },
      green: {
        lighter: "#68d391",
        default: "#48bb78",
        dark: "#38a169",
      },
      red: {
        lighter: "#FFF4F4",
        default: "#FF2020",
        dark: "#c53030",
      },
      white: {
        default: "#ffffff",
        dark: "#fafafa",
      },
      black: {
        default: "#000000",
      },
    },
  },
  variants: {},
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
