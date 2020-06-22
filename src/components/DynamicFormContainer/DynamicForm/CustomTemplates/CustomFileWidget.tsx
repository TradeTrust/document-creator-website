import React, { FunctionComponent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { numberWithCommas } from "../../../../common/utils";
import { Button } from "../../../../UI/Button";
import { SvgIcon, SvgIconPaperClip, SvgIconX } from "../../../../UI/SvgIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomFileWidget: FunctionComponent<any> = ({ multiple, options, disabled }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [totalFilesSize, setTotalFilesSize] = useState(0);
  const [fileSizeError, setFileSizeError] = useState(false);

  const maxSize = 20000000;

  const onDrop = useCallback(
    (files) => {
      let fileSizeUploaded = 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      files.forEach((file: any) => {
        fileSizeUploaded += file.size;
      });

      if (totalFilesSize + fileSizeUploaded <= maxSize) {
        const totalFileSizeUploaded = totalFilesSize + fileSizeUploaded;
        setTotalFilesSize(totalFileSizeUploaded);

        setUploadedFiles([...uploadedFiles, ...files]);
      } else {
        setFileSizeError(true);
      }
    },
    [uploadedFiles, totalFilesSize]
  );

  const removeFile = (fileIndex: number): void => {
    const removedFileInfo = uploadedFiles[fileIndex];
    const filtered = uploadedFiles.filter((item, index) => {
      return index !== fileIndex;
    });
    setUploadedFiles(filtered);

    const updatedFilesSize = totalFilesSize - removedFileInfo.size;
    setTotalFilesSize(updatedFilesSize);
    setFileSizeError(false);
  };

  const dropZone = useDropzone({
    onDrop,
    accept: options.accept,
    multiple,
    disabled,
  });

  const { getRootProps, getInputProps, isDragActive, fileRejections } = dropZone;
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
    <div className="flex flex-col max-w-screen-sm m-auto" key="CustomFileWidget">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={dropZoneCSS}>
          {isFileRejected && (
            <>
              <div className="max-w-lg text-red font-bold text-lg">
                Error: Incorrect file type selected
              </div>
              <div className="text-base text-grey-dark my-4">{`Only ${options.accept} are allowed`}</div>
            </>
          )}
          {fileSizeError && (
            <>
              <div className="max-w-lg text-red font-bold text-lg">
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
      <FilesInfo removeFile={removeFile} uploadedFiles={uploadedFiles} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilesInfo: FunctionComponent<any> = ({ removeFile, uploadedFiles }) => {
  if (uploadedFiles.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
      {uploadedFiles.map((file: { path: string; name: string; size: number }, index: string) => {
        return (
          <li
            key={index}
            data-testid={`upload-file-${index}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            <div className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2">
              <SvgIcon>
                <SvgIconPaperClip />
              </SvgIcon>
            </div>

            <p className="font-bold text-grey-dark flex-grow">
              {file.name}
              <span className="text-grey text-xs font-regular">
                {" "}
                ({numberWithCommas(file.size)}KB)
              </span>
            </p>

            <div
              className="cursor-pointer"
              data-testid={`remove-uploaded-file-${index}`}
              onClick={() => {
                removeFile(index);
              }}
            >
              <SvgIcon>
                <SvgIconX />
              </SvgIcon>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
