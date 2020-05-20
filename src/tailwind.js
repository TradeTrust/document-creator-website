const plugin = require("tailwindcss/plugin");

module.exports = {
  theme: {
    fontFamily: {
      display: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      body: ["Roboto", "Helvetica", "Arial", "sans-serif"],
    },
    fontWeight: {
      regular: 400,
      bold: 700,
    },
    extend: {
      colors: {
        primary: {
          default: "#FF9220",
        },
        secondary: {
          default: "#E6F5FA",
        }
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function({ addBase, config }) {
      addBase({
        "h1": { fontWeight: config("theme.fontWeight.bold") },
        "h2": { fontWeight: config("theme.fontWeight.bold") },
        "h3": { fontWeight: config("theme.fontWeight.bold") },
        "h4": { fontWeight: config("theme.fontWeight.bold") },
        "h5": { fontWeight: config("theme.fontWeight.bold") },
        "h6": { fontWeight: config("theme.fontWeight.bold") },
      })
    })
  ],
};