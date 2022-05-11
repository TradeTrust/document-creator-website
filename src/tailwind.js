const _ = require("lodash");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

// https://tailwindcss.com/docs/theme
const localConfig = {
  content: [
    `./src/**/*.{js,jsx,ts,tsx}`,
    `./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    fontFamily: {
      "gilroy-light": ["Gilroy-Light", "sans-serif"],
      "gilroy-medium": ["Gilroy-Medium", "sans-serif"],
      "gilroy-bold": ["Gilroy-Bold", "sans-serif"],
      "gilroy-extrabold": ["Gilroy-ExtraBold", "sans-serif"],
    },
    extend: {
      inset: {
        4: "1rem",
        8: "2rem",
        12: "3rem",
      },
    },
  },
};
const finalConfig = _.merge(commonUiConfig, localConfig); // deep merge

module.exports = finalConfig;
