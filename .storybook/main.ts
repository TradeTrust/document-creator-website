import type { StorybookConfig } from "@storybook/react-webpack5";

import * as nodejsPolyfillWebpack from "../nodejs-polyfill-webpack.js";
import * as path from "path";
const toPath = (_path: any) => path.join(process.cwd(), _path);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/preset-create-react-app",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-styling-webpack",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: (config: any) => {
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
  staticDirs: ["../public"],
};
export default config;
