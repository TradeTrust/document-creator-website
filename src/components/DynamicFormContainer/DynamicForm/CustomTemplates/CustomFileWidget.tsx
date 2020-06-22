import React, { FunctionComponent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { showInKB } from "../../../../common/utils";
import { Button } from "../../../../UI/Button";
import { SvgIcon, SvgIconPaperClip, SvgIconX } from "../../../../UI/SvgIcon";

interface FileUploadType {
  dataURL: string;
  name: string;
  size: number;
  type: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomFileWidget: FunctionComponent<any> = ({
  onChange,
  multiple,
  options,
  disabled,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);
  const [fileSizeError, setFileSizeError] = useState(false);

  const maxSize = 20000000;

  const onDrop = useCallback(
    (files: File[]) => {
      let totalSize = uploadedFiles.reduce((acc, current) => acc + current.size, 0);
      files.forEach((file: File) => {
        totalSize += file.size;
      });

      if (totalSize <= maxSize) {
        setFileSizeError(false);

        processFiles(files).then((info: FileUploadType[]) => {
          const allFiles = uploadedFiles.concat(info);
          setUploadedFiles(allFiles);

          const dataValue = allFiles.map((fileInfo: FileUploadType) => fileInfo.dataURL);
          onChange(dataValue);
        });
      } else {
        setFileSizeError(true);
      }
    },
    [onChange, uploadedFiles]
  );

  const removeFile = (fileIndex: number): void => {
    setFileSizeError(false);

    const latestFiles = uploadedFiles.filter((item, index) => index !== fileIndex);
    setUploadedFiles(latestFiles);

    const dataValue = latestFiles.map((fileInfo: FileUploadType) => fileInfo.dataURL);
    onChange(dataValue);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: options.accept,
    multiple,
    disabled,
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
      <FilesInfo filesInfo={uploadedFiles} removeFile={removeFile} />
    </div>
  );
};

interface FilesInfoType {
  filesInfo: FileUploadType[];
  removeFile: (index: number) => void;
}

export const FilesInfo: FunctionComponent<FilesInfoType> = ({ filesInfo, removeFile }) => {
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {filesInfo.map(({ name, size }: FileUploadType, key: number) => {
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            <div
              className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2"
              data-testid={`attachment-icon-${key}`}
            >
              <SvgIcon>
                <SvgIconPaperClip />
              </SvgIcon>
            </div>

            <p className="font-bold text-grey-dark flex-grow">
              {name}
              <span className="text-grey text-xs font-regular"> ({showInKB(size) || "0"}KB)</span>
            </p>

            <div
              className="cursor-pointer"
              data-testid={`remove-uploaded-file-${key}`}
              onClick={() => {
                removeFile(key);
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

const addNameToDataURL = (dataURL: string, name: string): string => {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
};

const processFile = (file: File): Promise<FileUploadType> => {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      resolve({
        dataURL: addNameToDataURL(event?.target?.result as string, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
};

const processFiles = (files: File[]): Promise<FileUploadType[]> => {
  return Promise.all([].map.call(files, processFile)) as Promise<FileUploadType[]>;
};
