import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { Button } from "../../UI/Button";
import { ErrorAlert } from "../../Alert";
import { getLogger } from "../../../utils/logger";

const { stack } = getLogger("DataFileButton");
interface DataFileButton {
  onDataFile: (dataFile: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile }) => {
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await readFileAsJson<any>(file);
      setError(false);
      onDataFile(data);
    } catch (e) {
      stack(e);
      setError(true);
    }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: false });

  return (
    <>
      {error && (
        <div className="my-2" data-testid="file-read-error">
          <ErrorAlert message="File cannot be read" />
        </div>
      )}
      <div data-testid="data-upload-zone" {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <Button
          data-testid="data-upload-button"
          className={`text-center w-full p-2 bg-white text-orange border-grey-lighter border-solid border h-12`}
        >
          Upload Data File
        </Button>
      </div>
    </>
  );
};
