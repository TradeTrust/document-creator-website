import { ErrorObject } from "ajv";
import { trim } from "lodash";
import { FunctionComponent, useMemo, useState } from "react";
import { DropzoneOptions, FileRejection, useDropzone } from "react-dropzone";

type DropZonefileErrors = ErrorObject[] | Error[] | null | undefined;

interface DropZoneProps {
  defaultStyle: string;
  activeStyle: string;
  acceptStyle?: string;
  rejectStyle?: string;
  children: React.ReactNode;
  dropzoneOptions: DropzoneOptions;
  fileErrors?: DropZonefileErrors;
  dropzoneIcon?: string;
  dataTestId?: string;
}

// 5MB is 5242880 bytes as 1MB is 1048576 bytes
const BYTE_CONVERTION_RATE = 1048576;

const baseStyle = `cursor-pointer rounded-xl border-dashed border-2 border-cloud-100 items-center flex flex-col pt-16 pb-16 px-4 text-center mt-4`;
const errorStyle = `bg-red-100`;

export const StyledDropZone: FunctionComponent<DropZoneProps> = ({
  children,
  defaultStyle,
  activeStyle,
  acceptStyle,
  rejectStyle,
  dropzoneOptions,
  fileErrors,
  dropzoneIcon,
  dataTestId,
}) => {
  const [fileTypeError, setFileTypeError] = useState(false);
  const [fileSizeError, setFileSizeError] = useState(false);

  const onDrop = () => {
    setFileTypeError(false);
    setFileSizeError(false);
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const checkInvalidFileType = fileRejections.some((file) =>
        file.errors.some((error) => error.code === "file-invalid-type")
      );
      setFileTypeError(checkInvalidFileType);

      const checkInvalidFileSize = fileRejections.some((file) =>
        file.errors.some((error) => error.code === "file-too-large")
      );
      setFileSizeError(checkInvalidFileSize);
    }
  };
  dropzoneOptions.onDrop = onDrop;
  dropzoneOptions.onDropRejected = onDropRejected;

  const { getInputProps, getRootProps, isDragActive, isDragAccept, isDragReject } = useDropzone(dropzoneOptions);

  const error = fileTypeError || fileSizeError || !!fileErrors;
  const currentStyle = error ? errorStyle : defaultStyle;
  const dragStyle = useMemo(() => {
    return trim(`
      ${isDragActive ? ` ${activeStyle}` : ""}
      ${isDragAccept ? ` ${acceptStyle ?? ""}` : ""}
      ${isDragReject ? ` ${rejectStyle ?? ""}` : ""}
    `);
  }, [isDragActive, activeStyle, isDragAccept, acceptStyle, isDragReject, rejectStyle]);

  return (
    <div className={`${baseStyle} ${dragStyle || currentStyle} `} data-testid={dataTestId} {...getRootProps()}>
      <input {...getInputProps()} />
      {dropzoneIcon && <img className="mx-auto mb-8" src={dropzoneIcon} />}

      {error && <p className="max-w-lg text-rose text-lg leading-none font-bold mb-2">Error</p>}
      {fileTypeError && (
        <p className="max-w-lg text-rose text-lg leading-none mb-2" data-testid="invalid-file-error">
          Incorrect file type selected, Only {dropzoneOptions.accept} are allowed
        </p>
      )}
      {fileSizeError && (
        <p className="max-w-lg text-rose text-lg leading-none mb-2" data-testid="file-size-error">
          File size exceeds {dropzoneOptions.maxSize ? ` ${dropzoneOptions.maxSize / BYTE_CONVERTION_RATE}` : ""}MB,
          Please try again with a smaller file size.
        </p>
      )}
      {fileErrors &&
        fileErrors.length > 0 &&
        fileErrors.map((formError, index: number) => {
          return (
            <p key={index} className="max-w-lg text-rose text-lg leading-none mb-2" data-testid="file-error">
              {formError instanceof Error ? "" : formError.instancePath} {formError.message}
            </p>
          );
        })}

      <div className={error ? "mt-10" : ""}>{children}</div>
    </div>
  );
};
