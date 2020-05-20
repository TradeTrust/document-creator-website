import * as mixin from "../abstracts/mixin";

export const typography = (): string => {
  return `
    ${mixin.fontRobotoRegular()}

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      ${mixin.fontRobotoBold()}
    }

    h1 {
      ${mixin.fontSize(28)}
    }

    p {
      ${mixin.fontRobotoRegular()}
      ${mixin.fontSize(16)}
    }
  `;
};
