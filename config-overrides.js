const path = require("path");

module.exports = function override(config) {
  config.resolve.alias.react = path.resolve("./node_modules/react");
  config.devtool = process.env.NODE_ENV === "production" ? false : "eval-source-map"; // https://webpack.js.org/configuration/devtool/#devtool
  return config;
};
