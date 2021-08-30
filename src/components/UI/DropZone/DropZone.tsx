import { FunctionComponent } from "react";

interface DropZoneProps {
  isDragActive?: boolean;
  error?: boolean;
  children: React.ReactNode;
}

export const DropZone: FunctionComponent<DropZoneProps> = ({ children, isDragActive, error }) => {
  let dropZoneCss = `cursor-pointer bg-white rounded-xl border-dashed border-2 items-center flex flex-col pt-16 pb-16 px-4 text-center`;

  dropZoneCss += error ? ` border-red` : ` border-gray-300`;

  dropZoneCss += error ? (isDragActive ? ` bg-gray-300` : `bg-red-100`) : isDragActive ? `bg-gray-300` : `bg-white`;

  return <div className={dropZoneCss}>{children}</div>;
};
