module.exports = {
  presets: [
    "@babel/preset-env", // Transpiles ES6+ syntax
    "@babel/preset-react", // Transpiles JSX
    "@babel/preset-typescript", // Transpiles TypeScript
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs", // Ensures ES Modules are transformed to CommonJS
  ],
};
