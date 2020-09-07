import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { Button } from "../../UI/Button";
import { Title } from "../../UI/Title";

const { stack } = getLogger("ConfigFileDropZone");
interface ConfigFileDropZone {
  errorMessage?: string;
  onConfigFile: (configFile: ConfigFile) => void;
}

export const ConfigFileDropZone: FunctionComponent<ConfigFileDropZone> = ({
  onConfigFile,
  errorMessage,
}) => {
  const [error, setError] = useState(false);
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<ConfigFile>(file);
      setError(false);
      onConfigFile(config);
    } catch (e) {
      setError(true);
      stack(e);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropZoneCSS =
    errorMessage || error
      ? `border-dashed border-2 items-center border-red flex flex-col pt-16 pb-16 px-4 text-center ${
          isDragActive ? "bg-grey-lighter" : "bg-red-lighter"
        }`
      : `border-dashed border-2 items-center border-grey-lighter flex flex-col pt-16 pb-16 px-4 text-center ${
          isDragActive ? "bg-grey-lighter" : "bg-white"
        }`;

  return (
    <>
      <Title className="mb-8">Upload Configuration File</Title>
      <div {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <div className={dropZoneCSS}>
          {error && (
            <div
              className="max-w-lg text-red font-bold text-lg"
              data-testid={"error-cannot-read-file"}
            >
              Error: File cannot be read
            </div>
          )}
          {errorMessage && !error && (
            <div className="max-w-lg text-red font-bold text-lg" data-testid={"config-error"}>
              {errorMessage}
            </div>
          )}
          {!errorMessage && !error && (
            <div className="font-bold text-lg text-grey-dark">Drag and drop file here</div>
          )}
          <div className="text-base text-grey-dark my-4">
            {errorMessage || error ? "Please try again." : "or"}
          </div>
          <Button className="py-3 px-12 bg-white text-orange hover:text-orange-dark border border-solid border-grey-lighter">
            Browse File
          </Button>
        </div>
      </div>
    </>
  );
};
