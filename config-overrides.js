const path = require("path");

module.exports = function override(config) {
  config.resolve.alias.react = path.resolve("./node_modules/react");
  if (process.env.NODE_ENV === "production") {
    config.devtool = false; // https://webpack.js.org/configuration/devtool/#devtool
  }
  return config;
};
