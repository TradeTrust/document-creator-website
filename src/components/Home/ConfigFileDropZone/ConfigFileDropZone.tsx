import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { Title } from "../../UI/Title";

const { stack } = getLogger("ConfigFileDropZone");
interface ConfigFileDropZone {
  errorMessage?: string;
  onConfigFile: (configFile: ConfigFile) => void;
}

export const ConfigFileDropZone: FunctionComponent<ConfigFileDropZone> = ({ onConfigFile, errorMessage }) => {
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
          isDragActive ? "bg-gray-300" : "bg-red-100"
        }`
      : `border-dashed border-2 items-center border-gray-300 flex flex-col pt-16 pb-16 px-4 text-center ${
          isDragActive ? "bg-gray-300" : "bg-white"
        }`;

  return (
    <>
      <Title className="mb-8">Create Document</Title>
      <div {...getRootProps()}>
        <input data-testid="config-file-drop-zone" {...getInputProps()} />
        <div className={dropZoneCSS}>
          {error && (
            <div className="max-w-lg text-red-500 font-bold text-lg" data-testid={"error-cannot-read-file"}>
              Error: File cannot be read
            </div>
          )}
          {errorMessage && !error && (
            <div className="max-w-lg text-red-500 font-bold text-lg" data-testid={"config-error"}>
              {errorMessage}
            </div>
          )}
          {!errorMessage && !error && (
            <div className="font-bold text-lg text-gray-800" data-testid="home-description">
              Drag and drop your configuration file here
            </div>
          )}
          <div className="text-base text-gray-800 my-4">{errorMessage || error ? "Please try again." : "or"}</div>
          <Button className="bg-white text-orange hover:text-orange-600 border-gray-300 px-12">Browse Files</Button>
        </div>
      </div>
    </>
  );
};
