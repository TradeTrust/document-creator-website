import { FunctionComponent } from "react";

interface DropZoneProps {
  isDragActive?: boolean;
  error?: boolean;
  children: React.ReactNode;
  customDropZoneCss?: string;
}

export const DropZone: FunctionComponent<DropZoneProps> = ({ children, isDragActive, error, customDropZoneCss }) => {
  let dropZoneCss = `cursor-pointer rounded-xl border-dashed border-2 border-cloud-100 items-center flex flex-col pt-16 pb-16 px-4 text-center`;

  dropZoneCss += error ? ` bg-red-100` : ` bg-white`;

  dropZoneCss += error ? (isDragActive ? ` bg-gray-300` : ` bg-red-100`) : isDragActive ? ` bg-gray-300` : ` bg-white`;

  return <div className={customDropZoneCss ?? dropZoneCss}>{children}</div>;
};
