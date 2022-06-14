const nodejsPolyfillWebpack = require("../nodejs-polyfill-webpack.js");
const path = require("path");
const toPath = (_path) => path.join(process.cwd(), _path);

module.exports = {
  stories: ["../src/**/*.stories.@(tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  webpackFinal: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          // https://github.com/storybookjs/storybook/issues/13277#issuecomment-751747964
          ...config.resolve.alias,
          "@emotion/core": toPath("node_modules/@emotion/react"),
          "@emotion/styled": toPath("node_modules/@emotion/styled"),
          "emotion-theming": toPath("node_modules/@emotion/react"),
        },
        fallback: nodejsPolyfillWebpack.fallback(config),
      },
      plugins: nodejsPolyfillWebpack.plugins(config),
    };
  },
};
