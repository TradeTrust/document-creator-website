import { Button } from "@tradetrust-tt/tradetrust-ui-components";
import React, { FunctionComponent, useEffect, useState } from "react";
import { readFileAsJson } from "../../../common/utils";
import { ConfigFile } from "../../../types";
import { getLogger } from "../../../utils/logger";
import { ContentFrame } from "../../UI/ContentFrame";
import { StyledDropZone } from "../../UI/StyledDropZone";

const { stack } = getLogger("ConfigFileDropZone");
interface ConfigFileDropZone {
  errorMessage?: string;
  onConfigFile: (configFile: ConfigFile) => void;
}

export const ConfigFileDropZone: FunctionComponent<ConfigFileDropZone> = ({ onConfigFile, errorMessage }) => {
  const [fileErrors, setFileErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (errorMessage) {
      const malformedError = new Error(errorMessage);
      setFileErrors([malformedError]);
    } else {
      setFileErrors([]);
    }
  }, [errorMessage]);

  const onDropAccepted = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      const config = await readFileAsJson<ConfigFile>(file);
      setFileErrors([]);
      onConfigFile(config);
    } catch (e) {
      if (e instanceof Error) {
        const readFileError = new Error("Document cannot be read. Please check that you have a valid document");
        setFileErrors([readFileError]);
        stack(e);
      }
    }
  };

  const defaultStyle = "bg-white";
  const activeStyle = "border-green-400 bg-green-50";
  const acceptStyle = "border-green-400 bg-green-50";
  const dropzoneOptions = {
    onDropAccepted,
    maxFiles: 1,
  };

  return (
    <>
      <h2 data-testid="config-dropzone-title" className="mb-8">
        Create and Revoke Document
      </h2>
      <ContentFrame>
        <StyledDropZone
          dropzoneOptions={dropzoneOptions}
          defaultStyle={defaultStyle}
          activeStyle={activeStyle}
          acceptStyle={acceptStyle}
          fileErrors={fileErrors}
          dropzoneIcon={"/dropzone-graphic.png"}
          dataTestId="config-file-dropzone"
        >
          <h4 data-testid="home-description">Drag and drop your configuration file here</h4>
          <p className="my-4">or</p>
          <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800 border-cloud-800 block mx-auto mb-5">
            Select Document
          </Button>
          <a
            onClick={(e) => e.stopPropagation()}
            className="text-cerulean-300 mt-8 hover:text-cerulean-500"
            href="https://docs.tradetrust.io/docs/reference/document-creator/config-file"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="no-config-file-button"
          >
            <h5>Don’t have a config file? Learn how to create one</h5>
          </a>
        </StyledDropZone>
      </ContentFrame>
    </>
  );
};
