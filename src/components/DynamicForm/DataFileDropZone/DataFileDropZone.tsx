import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ErrorAlert } from "../../Alert";

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

  return (
    <>
      {error && (
        <div className="my-2">
          <ErrorAlert message="File cannot be read" />
        </div>
      )}
      <div {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <div
          className={`text-center w-100 border-dashed border-2 border-gray-600 p-2 text-primary ${
            isDragActive ? "bg-gray-400" : "bg-white"
          }`}
        >
          Upload Data File
        </div>
      </div>
    </>
  );
};
