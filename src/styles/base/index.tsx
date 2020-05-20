import { global } from "./global";
import { typography } from "./typography";

export const base = (): string => {
  return `
    ${global()}
    ${typography()}
  `;
};
