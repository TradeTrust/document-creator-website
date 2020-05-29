import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { Button } from "../../../UI/Button";
import { ErrorAlert } from "../../Alert";

interface DataFileButton {
  onDataFile: (dataFile: any) => void;
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile }) => {
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
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <>
      {error && (
        <div className="my-2">
          <ErrorAlert message="File cannot be read" />
        </div>
      )}
      <div {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <Button className={`text-center w-full p-2 bg-white text-orange`}>Upload Data File</Button>
      </div>
    </>
  );
};
