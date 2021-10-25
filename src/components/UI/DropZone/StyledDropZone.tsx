import { FunctionComponent, useMemo } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface DropZoneProps {
  defaultStyle?: string;
  activeStyle?: string;
  acceptStyle?: string;
  rejectStyle?: string;
  children: React.ReactNode;
  dropzoneOptions: DropzoneOptions;
  testId?: string;
}

const baseStyle = `cursor-pointer rounded-xl border-dashed border-2 border-cloud-100 items-center flex flex-col pt-16 pb-16 px-4 text-center`;

export const StyledDropZone: FunctionComponent<DropZoneProps> = ({
  children,
  defaultStyle,
  activeStyle,
  acceptStyle,
  rejectStyle,
  dropzoneOptions,
  testId,
}) => {
  const { getInputProps, getRootProps, isDragActive, isDragAccept, isDragReject } = useDropzone(dropzoneOptions);

  const dragStyle = useMemo(() => {
    return `
      ${isDragActive ? activeStyle : ""} 
      ${isDragAccept ? acceptStyle : ""} 
      ${isDragReject ? rejectStyle : ""} 
    `;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragActive, isDragAccept, isDragReject]);
  return (
    <div className={style} data-testid="data-upload-zone" {...getRootProps()}>
      <input {...getInputProps()} data-testid={testId} />
      {children}
    </div>
  );
};
