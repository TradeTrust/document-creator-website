const webpack = require("webpack");

module.exports = {
  fallback: (config) => {
    return {
      ...config.resolve.fallback,
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer"),
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      zlib: require.resolve("browserify-zlib"),
      fs: false,
    };
  },
  plugins: (config) => {
    return [
      ...config.plugins,
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ContextReplacementPlugin(/@mattrglobal/),
    ];
  },
};
