const _ = require("lodash");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

// https://tailwindcss.com/docs/theme
const localConfig = {
  purge: {
    content: [
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.tsx",
    ],
  },
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      display: ["Roboto", "sans-serif"],
      body: ["Roboto", "sans-serif"],
    },
  },
};
const finalConfig = _.merge(commonUiConfig, localConfig); // deep merge

module.exports = finalConfig;
