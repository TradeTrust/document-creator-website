// If you update anything here, please update tailwind.js file too. Since we are using tailwind and emotion style component together.
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.js";
const fullConfig = resolveConfig(tailwindConfig);

export const white = `${fullConfig.theme.colors.white.default}`;
export const black = `${fullConfig.theme.colors.black.default}`;
export const whiteDark = `${fullConfig.theme.colors.white.dark}`;
export const grey = `${fullConfig.theme.colors.grey.default}`;
export const greyLighter = `${fullConfig.theme.colors.grey.lighter}`;
export const greyDark = `${fullConfig.theme.colors.grey.dark}`;
export const blue = `${fullConfig.theme.colors.blue.default}`;
export const blueLighter = `${fullConfig.theme.colors.blue.lighter}`;
export const blueDark = `${fullConfig.theme.colors.blue.dark}`;
export const orange = `${fullConfig.theme.colors.orange.default}`;
export const orangeDark = `${fullConfig.theme.colors.orange.dark}`;
export const orangeLighter = `${fullConfig.theme.colors.orange.lighter}`;
export const green = `${fullConfig.theme.colors.green.default}`;
export const greenLighter = `${fullConfig.theme.colors.green.lighter}`;
export const greenDark = `${fullConfig.theme.colors.green.dark}`;
export const red = `${fullConfig.theme.colors.red.default}`;
export const redDark = `${fullConfig.theme.colors.red.dark}`;
export const redLighter = `${fullConfig.theme.colors.red.lighter}`;
export const teal = `${fullConfig.theme.colors.teal.default}`;
export const tealLighter = `${fullConfig.theme.colors.teal.lighter}`;

export const buttonRadius = "4px";

export const easeInCubic = "cubic-bezier(0.55, 0.055, 0.675, 0.19)";
export const easeOutCubic = "cubic-bezier(0.215, 0.61, 0.355, 1)";
export const easeInOutCubic = "cubic-bezier(0.645, 0.045, 0.355, 1)";
