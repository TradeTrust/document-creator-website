import { Config } from "../../types";

export const generateFileName = (
  config: Config | undefined,
  fileName: string,
  extension: string
): string => {
  return `${fileName}${config?.network === "homestead" ? "" : `-${config?.network}`}.${extension}`;
};
