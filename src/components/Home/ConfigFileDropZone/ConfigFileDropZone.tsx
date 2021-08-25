import { Button, ButtonSize } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { Frame } from "../../UI/Frame";
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

  let dropZoneCSS = `cursor-pointer border-dashed border-2 items-center flex flex-col py-12 px-4 text-center`;

  if (errorMessage || error) {
    dropZoneCSS += ` border-red`;

    if (isDragActive) {
      dropZoneCSS += ` bg-gray-300`;
    } else {
      dropZoneCSS += ` bg-red-100`;
    }
  } else {
    dropZoneCSS += ` border-gray-300`;

    if (isDragActive) {
      dropZoneCSS += ` bg-gray-300`;
    } else {
      dropZoneCSS += ` bg-white`;
    }
  }

  return (
    <div>
      <Title className="mb-4">Create and Revoke Document</Title>
      <Frame>
        <div {...getRootProps()}>
          <input data-testid="config-file-drop-zone" {...getInputProps()} />
          <div className={dropZoneCSS}>
            <img src={"/static/create-revoke-icon.png"} />
            <div className="py-8">{renderConditionalContent(error, errorMessage)}</div>
            <a
              onClick={(e) => e.stopPropagation()}
              className="text-cerulean-200 font-bold text-sm"
              href="https://docs.tradetrust.io/docs/document-creator/config-file"
              target="_blank"
              rel="noopener noreferrer"
            >
              Don’t have a config file? Learn how to create one
            </a>
          </div>
        </div>
      </Frame>
    </div>
  );
};

const renderConditionalContent = (error: boolean, errorMessage?: string) => {
  let mainMessageComponent = (
    <div className="font-bold text-lg">
      Drag and drop your configuration file here
      <div className="py-4">or</div>
    </div>
  );

  let buttonMessage = "Select File";

  if (error) {
    mainMessageComponent = (
      <div className="max-w-lg text-red-500 font-bold text-lg py-4" data-testid={"error-cannot-read-file"}>
        Error: File cannot be read
      </div>
    );

    buttonMessage = "Try Again";
  }

  if (errorMessage) {
    mainMessageComponent = (
      <div className="max-w-lg text-red-500 font-bold text-lg py-4" data-testid={"config-error"}>
        {errorMessage}
      </div>
    );

    buttonMessage = "Try Again";
  }

  return (
    <>
      {mainMessageComponent}
      <Button size={ButtonSize.MD} className="bg-cerulean text-white hover:bg-cerulean-500 hover:text-white">
        {buttonMessage}
      </Button>
    </>
  );
};
