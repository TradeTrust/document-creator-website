const _ = require("lodash");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

// https://tailwindcss.com/docs/theme
const localConfig = {
  theme: {
    extend: {
      colors: {
        lightgrey: {
          lightest: "#cccccc",
          lighter: "#fafafa",
          default: "#eeeeee",
          dark: "#89969F",
        },
        greyblue: {
          default: "#c1c9d1",
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
        navy: {
          default: "#324353",
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
  },
};
const finalConfig = _.merge(commonUiConfig, localConfig); // deep merge

module.exports = finalConfig;
