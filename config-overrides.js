const nodejsPolyfillWebpack = require("./nodejs-polyfill-webpack.js");

module.exports = function override(config) {
  const configOverrides = {
    ...config,
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions, ".ts", ".tsx", ".js"],
      fallback: nodejsPolyfillWebpack.fallback(config),
    },
    plugins: nodejsPolyfillWebpack.plugins(config),
    devtool: !process.env.NODE_ENV === "production",
  };
  return configOverrides;
};
