import React, { FunctionComponent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUploadType } from "../../../../types";
import { Button } from "../../../UI/Button";
import { FilesInfo } from "./FilesInfo";

const MAX_FILE_SIZE = 20971520;

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

      files.reduce((acc: number, current: File) => (totalSize += current.size), 0);

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
    <div className="flex flex-col max-w-screen-sm m-auto" key="AttachmentDropzone">
      <legend>Attachments</legend>
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
                Error: Total attachment file size exceeds 20MB
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

const processFiles = (file: File): Promise<FileUploadType> => {
  const { name, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      resolve({
        data: extractBase64(event?.target?.result as string, type),
        filename: name,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
};

const extractBase64 = (dataURL: string, type: string): string => {
  return dataURL.replace(`data:${type};base64,`, "");
};
