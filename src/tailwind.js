const _ = require("lodash");
const commonUiConfig = require("@govtechsg/tradetrust-ui-components/build/tailwind");

// https://tailwindcss.com/docs/theme
const localConfig = {
  purge: {
    content: ["./src/**/*.ts", "./src/**/*.tsx", "./node_modules/@govtechsg/tradetrust-ui-components/src/**/*.tsx"],
  },
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      display: ["Roboto", "sans-serif"],
      body: ["Roboto", "sans-serif"],
    },
    extend: {
      inset: {
        4: "1rem",
        8: "2rem",
        12: "3rem",
      },
    },
    backgroundImage: (theme) => ({
      "wave-lines": "url('./img/wave-lines.png')",
    }),
  },
  variants: {
    extend: {
      margin: ["last"],
    },
  },
};
const finalConfig = _.merge(commonUiConfig, localConfig); // deep merge

module.exports = finalConfig;
