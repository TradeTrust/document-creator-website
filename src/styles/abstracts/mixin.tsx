import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.js";
const fullConfig = resolveConfig(tailwindConfig);

export const fontRobotoRegular = (): string => {
  return `
    font-family: ${fullConfig.theme.fontFamily.body.join(", ")};
    font-weight: ${fullConfig.theme.fontWeight.regular};
  `;
};

export const fontRobotoBold = (): string => {
  return `
    font-family: ${fullConfig.theme.fontFamily.body.join(", ")};
    font-weight: ${fullConfig.theme.fontWeight.bold};
  `;
};

const pxToRem = (size: number, base = 16): string => {
  return (size / base) * 1 + "rem";
};

export const fontSize = (size = 16): string => {
  return `
    font-size: ${size}px;
    font-size: ${pxToRem(size)};
  `;
};
