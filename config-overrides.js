var path = require('path');

module.exports = function override(config) {
  config.resolve.alias.react = path.resolve('./node_modules/react')
  return config;
}
