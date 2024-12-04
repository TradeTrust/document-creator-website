const nodejsPolyfillWebpack = require("./nodejs-polyfill-webpack.js");

module.exports = function override(config) {
  const fileLoaderRule = getFileLoaderRule(config.module.rules);
  if (!fileLoaderRule) {
    throw new Error("File loader not found");
  }
  fileLoaderRule.exclude.push(/\.cjs$/);

  const configOverrides = {
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        process: "process/browser",
      },
      extensions: [...config.resolve.extensions, ".ts", ".tsx", ".js"],
      fallback: nodejsPolyfillWebpack.fallback(config),
    },
    plugins: nodejsPolyfillWebpack.plugins(config),
    devtool: !process.env.NODE_ENV === "production",
  };
  return configOverrides;
};

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ("oneOf" in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === "asset/resource") {
      return rule;
    }
  }
}
