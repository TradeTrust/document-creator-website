interface generateFileNameI {
  network?: string;
  fileName: string;
  extension: string;
  timestamp?: string;
}

export const generateFileName = ({
  network,
  fileName,
  extension,
  timestamp,
}: generateFileNameI): string => {
  const fileNetwork = network === "homestead" ? "" : `-${network}`;
  const fileTimestamp = timestamp ? `-${timestamp}` : "";
  return `${fileName}${fileNetwork}${fileTimestamp}.${extension}`;
};

export const generateErrorLogFileName = (): string => {
  const dateFormat = new Date().toISOString();
  return `error-log_${dateFormat}`;
};
