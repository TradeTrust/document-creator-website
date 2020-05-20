export const fontRobotoRegular = (): string => {
  return `
    font-family: "Roboto", Helvetica, Arial, sans-serif;
    font-weight: 400;
  `;
};

export const fontRobotoBold = (): string => {
  return `
    font-family: "Roboto", Helvetica, Arial, sans-serif;
    font-weight: 700;
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
