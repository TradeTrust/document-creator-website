import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { ErrorAlert } from "../../Alert";

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
      const config = await readFileAsJson<any>(file);
      setError(false);
      onDataFile(config);
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
          className="w-full bg-white text-orange border-grey-400 hover:bg-grey-100"
        >
          Upload Data File
        </Button>
      </div>
    </>
  );
};
