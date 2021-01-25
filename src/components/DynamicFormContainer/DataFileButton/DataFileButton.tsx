import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson, readFileAsCsv } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { ErrorAlert } from "../../Alert";
import { useFormsContext } from "../../../common/context/forms";

const { stack } = getLogger("DataFileButton");
interface DataFileButton {
  onDataFile: (dataFile: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const DataFileButton: FunctionComponent<DataFileButton> = ({ onDataFile }) => {
  const { currentFormTemplate } = useFormsContext();
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      let data = null;
      if (file.name.indexOf(".csv") > 0) {
        data = await readFileAsCsv(file, currentFormTemplate?.headers);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = await readFileAsJson<any>(file);
      }
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
          className="w-full bg-white text-orange border-grey-400 hover:bg-grey-100"
        >
          Upload Data File
        </Button>
      </div>
    </>
  );
};
