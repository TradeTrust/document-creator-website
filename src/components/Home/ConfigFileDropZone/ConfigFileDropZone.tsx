import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { ContentFrame } from "../../UI/ContentFrame";
import { DropZone } from "../../UI/DropZone";

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

  return (
    <>
      <h2 data-testid="config-dropzone-title" className="mb-8">
        Create and Revoke Document
      </h2>
      <ContentFrame>
        <div {...getRootProps()}>
          <input data-testid="config-file-drop-zone" {...getInputProps()} />
          <DropZone
            isDragActive={isDragActive}
            error={(errorMessage !== undefined && errorMessage.length > 0) || error}
          >
            <img className="mb-12" src={"/dropzone-graphic.png"} />
            {error && (
              <div className="max-w-lg text-rose font-bold text-lg" data-testid={"error-cannot-read-file"}>
                Document cannot be read. Please check that you have a valid document
              </div>
            )}
            {errorMessage && !error && (
              <div className="max-w-lg text-rose font-bold text-lg" data-testid={"config-error"}>
                {errorMessage}
              </div>
            )}
            {!errorMessage && !error && (
              <h4 data-testid="home-description">Drag and drop your configuration file here</h4>
            )}
            <h4 className="my-4">{errorMessage || error ? "Please try again." : "or"}</h4>
            <Button className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 px-3">
              Select Document
            </Button>
            <a
              onClick={(e) => e.stopPropagation()}
              className="text-cerulean-200 font-bold mt-8"
              href="https://docs.tradetrust.io/docs/document-creator/config-file"
              target="_blank"
              rel="noopener noreferrer"
            >
              Don’t have a config file? Learn how to create one
            </a>
          </DropZone>
        </div>
      </ContentFrame>
    </>
  );
};
