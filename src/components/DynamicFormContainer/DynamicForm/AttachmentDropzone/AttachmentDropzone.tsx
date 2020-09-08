import React, { FunctionComponent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUploadType } from "../../../../types";
import { Button } from "../../../UI/Button";
import { FilesInfo } from "./FilesInfo";

// 5MB is 5242880 bytes as 1MB is 1048576 bytes
const MAX_FILE_SIZE = 5242880;
const BYTE_CONVERTION_RATE = 1048576;

interface AttachmentDropzone {
  acceptedFormat: string;
  onUpload: (processedFiles: FileUploadType[]) => void;
  onRemove: (fileIndex: number) => void;
  uploadedFiles: FileUploadType[];
}

export const AttachmentDropzone: FunctionComponent<AttachmentDropzone> = ({
  acceptedFormat,
  onUpload,
  onRemove,
  uploadedFiles,
}) => {
  const [fileSizeError, setFileSizeError] = useState(false);

  const onDrop = useCallback(
    async (files: File[]) => {
      let totalSize = uploadedFiles
        ? uploadedFiles.reduce(
            (acc: number, current: FileUploadType) => acc + atob(current.data).length,
            0
          )
        : 0;

      files.forEach((file) => (totalSize += file.size));

      if (totalSize > MAX_FILE_SIZE) return setFileSizeError(true);

      const processedFiles = await Promise.all(files.map(processFiles));
      onUpload(processedFiles);
      setFileSizeError(false);
    },
    [onUpload, uploadedFiles]
  );

  const removeFile = (fileIndex: number): void => {
    onRemove(fileIndex);
    setFileSizeError(false);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: acceptedFormat,
  });

  const isFileRejected = fileRejections.length > 0;
  const error = isFileRejected || fileSizeError;

  const dropZoneCSS = error
    ? `border-dashed border-2 items-center border-red flex flex-col pt-16 pb-16 px-4 text-center ${
        isDragActive ? "bg-grey-lighter" : "bg-red-lighter"
      }`
    : `border-dashed border-2 items-center border-grey-lighter flex flex-col pt-16 pb-16 px-4 text-center ${
        isDragActive ? "bg-grey-lighter" : "bg-white"
      }`;

  return (
    <div
      className="flex flex-col max-w-screen-sm m-auto"
      key="AttachmentDropzone"
      data-testid="attachment-dropzone"
    >
      <legend>Attachments</legend>
      <div className="text-grey-dark">
        Max. total file size: {MAX_FILE_SIZE / BYTE_CONVERTION_RATE}MB
      </div>
      <div data-testid="attachment-upload-zone" className="mt-4" {...getRootProps()}>
        <input data-testid="attachment-file-drop-zone" {...getInputProps()} />
        <div className={dropZoneCSS}>
          {isFileRejected && (
            <>
              <div className="max-w-lg text-red font-bold text-lg" data-testid="invalid-file-error">
                Error: Incorrect file type selected
              </div>
              <div className="text-base text-grey-dark my-4">{`Only ${acceptedFormat} are allowed`}</div>
            </>
          )}
          {fileSizeError && (
            <>
              <div className="max-w-lg text-red font-bold text-lg" data-testid="file-size-error">
                Error: Total attachment file size exceeds {MAX_FILE_SIZE / BYTE_CONVERTION_RATE}MB
              </div>
              <div className="text-base text-grey-dark my-4">
                Please try again with a smaller file size.
              </div>
            </>
          )}
          {!error && (
            <>
              <div className="font-bold text-lg text-grey-dark">Drag and drop file here</div>
              <div className="text-base text-grey-dark my-4">or</div>
            </>
          )}
          <Button className="py-3 px-12 bg-white text-orange hover:text-orange-dark border border-solid border-grey-lighter">
            Browse File
          </Button>
        </div>
      </div>
      <FilesInfo filesInfo={uploadedFiles} removeFile={removeFile} />
    </div>
  );
};

export const fileInfo = (dataUrl: string): { type: string; data: string } => {
  const result = dataUrl.match(/^data:(.+);base64,(.*)/);
  if (!result) throw new Error(`File data cannot be read: ${dataUrl}`);
  const [, type, data] = result;
  return {
    type,
    data,
  };
};

const processFiles = (file: File): Promise<FileUploadType> => {
  const { name } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      const { data, type } = fileInfo(event?.target?.result as string);
      resolve({
        data,
        filename: name,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
};
