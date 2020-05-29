import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
// import { ErrorAlert } from "../../Alert";
import { Button } from "../../../UI/Button";

interface DataFileDropZone {
  onDataFile: (dataFile: any) => void;
}

export const DataFileDropZone: FunctionComponent<DataFileDropZone> = ({ onDataFile }) => {
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<any>(file);
      setError(false);
      onDataFile(config);
    } catch (e) {
      setError(true);
      console.error(e);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropZoneCSS = error
    ? `border-dashed border-2 items-center border-red flex flex-col pt-16 pb-16 px-4 text-center w-full ${
        isDragActive ? "bg-grey-lighter" : "bg-red-lighter"
      }`
    : `border-dashed border-2 items-center border-grey-lighter flex flex-col pt-16 pb-16 px-4 text-center w-full ${
        isDragActive ? "bg-grey-lighter" : "bg-white"
      }`;

  return (
    <>
      {/* <div {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <div
          className={`text-center w-100 border-dashed border-2 border-gray-600 p-2 text-grey-lighter ${
            isDragActive ? "bg-gray-400" : "bg-white"
          }`}
        >
          Upload Data File
        </div>
      </div>
      {error && (
        <div className="my-2 w-full mx-4">
          <ErrorAlert message="File cannot be read" />
        </div>
      )} */}
      <div {...getRootProps()} className="file-drop-zone">
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
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
    </>
  );
};
