interface generateFileNameI {
  network?: string;
  fileName: string;
  extension: string;
  hasTimestamp?: boolean;
}

export const generateFileName = ({ network, fileName, extension, hasTimestamp }: generateFileNameI): string => {
  const timestamp = new Date().toISOString();
  const fileNetwork = network === "homestead" ? "" : `-${network}`;
  const fileTimestamp = hasTimestamp ? `-${timestamp}` : "";
  return `${fileName}${fileNetwork}${fileTimestamp}.${extension}`;
};
