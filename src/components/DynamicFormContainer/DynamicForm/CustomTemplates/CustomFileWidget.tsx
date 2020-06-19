import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../../../../UI/Button";
import { SvgIcon, SvgIconPaperClip, SvgIconX } from "../../../../UI/SvgIcon";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomFileWidget: FunctionComponent<any> = ({
  onChange,
  value,
  multiple,
  options,
  disabled,
}) => {
  const [filesInfo, setFilesInfo] = useState(
    extractFileInfo(Array.isArray(value) ? value : [value])
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const maxSize = 20000000;

  useEffect(() => {
    setFilesInfo(extractFileInfo(Array.isArray(value) ? value : [value]));
  }, [value]);

  const onDrop = useCallback(
    (files) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processFiles(files).then((filesInfo: any) => {
        const values = filesInfo.map((fileInfo: any) => fileInfo.dataURL); // eslint-disable-line @typescript-eslint/no-explicit-any
        const allFiles = uploadedFiles.concat(values);
        onChange(allFiles);
        setUploadedFiles(allFiles);
      });
    },
    [onChange, uploadedFiles]
  );

  const removeFile = (fileIndex: number): void => {
    const latestFiles = uploadedFiles;
    latestFiles.splice(fileIndex, 1);
    onChange(latestFiles);
    setUploadedFiles(latestFiles);
    setFilesInfo(extractFileInfo(Array.isArray(latestFiles) ? latestFiles : [latestFiles]));
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: options.accept,
    multiple,
    maxSize,
    disabled,
  });

  const isFileTooLarge = fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
  const isFileRejected = fileRejections.length > 0;

  const error = isFileRejected || isFileTooLarge;

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
          {error && (
            <div className="max-w-lg text-red font-bold text-lg">Error: File cannot be read</div>
          )}
          {!error && (
            <div className="font-bold text-lg text-grey-dark">Drag and drop file here</div>
          )}
          <div className="text-base text-grey-dark my-4">{error ? "Please try again." : "or"}</div>
          <Button className="py-3 px-12 bg-white text-orange hover:text-orange-dark border border-solid border-grey-lighter">
            Browse File
          </Button>
        </div>
      </div>
      <FilesInfo filesInfo={filesInfo} removeFile={removeFile} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FilesInfo: FunctionComponent<any> = ({ filesInfo, removeFile }) => {
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info mt-4">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
      {filesInfo.map((fileInfo: any, key: any) => {
        const { name, size } = fileInfo;
        return (
          <li
            key={key}
            data-testid={`upload-file-${key}`}
            className="border border-grey-lighter border-solid rounded my-1 h-16 flex items-center px-4"
          >
            <div className="rounded-full bg-grey-lighter h-12 w-12 flex items-center justify-center mr-2">
              <SvgIcon>
                <SvgIconPaperClip />
              </SvgIcon>
            </div>

            <p className="font-bold text-grey-dark flex-grow">
              {name}
              <span className="text-grey text-xs font-regular"> ({size}KB)</span>
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

interface DataURItoBlobType {
  blob: Blob;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataURItoBlob = (dataURI: any): DataURItoBlobType => {
  // Split metadata from data
  const splitted = dataURI.split(",");
  // Split params
  const params = splitted[0].split(";");
  // Get mime-type from params
  const type = params[0].replace("data:", "");
  // Filter the name property from params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const properties = params.filter((param: any) => {
    return param.split("=")[0] === "name";
  });
  // Look for the name and use unknown if no name property.
  let name;
  if (properties.length !== 1) {
    name = "unknown";
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split("=")[1];
  }

  // Built the Uint8Array Blob parameter from the base64 string.
  const binary = atob(splitted[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  // Create the blob object
  const blob = new window.Blob([new Uint8Array(array)], { type });

  return { blob, name };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addNameToDataURL = (dataURL: any, name: any): string => {
  return dataURL.replace(";base64", `;name=${encodeURIComponent(name)};base64`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processFile = (file: any): any => {
  const { name, size, type } = file;
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = reject;
    reader.onload = (event) => {
      resolve({
        dataURL: addNameToDataURL(event?.target?.result, name),
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processFiles = (files: any): any => {
  return Promise.all([].map.call(files, processFile));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractFileInfo = (dataURLs: any): any => {
  return (
    dataURLs
      .filter((dataURL: any) => typeof dataURL !== "undefined") // eslint-disable-line @typescript-eslint/no-explicit-any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((dataURL: any) => {
        const { blob, name } = dataURItoBlob(dataURL);
        return {
          name: name,
          size: blob.size,
          type: blob.type,
        };
      })
  );
};
