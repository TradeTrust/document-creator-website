import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { mixin } from "../../../styles";
import { ConfigFile } from "../../../types";
import { Button } from "../../../UI/Button";
import { Title } from "../../../UI/Title";
import { Wrapper } from "../../../UI/Wrapper";
import { ErrorAlert } from "../../Alert";

interface ConfigFileDropZone {
  errorMessage?: string;
  onConfigFile: (configFile: ConfigFile) => void;
}

export const ConfigFileDropZone: FunctionComponent<ConfigFileDropZone> = styled(
  ({ className, onConfigFile, errorMessage }) => {
    const [error, setError] = useState(false);
    const onDrop = async (files: File[]): Promise<void> => {
      try {
        const file = files[0];
        const config = await readFileAsJson<ConfigFile>(file);
        setError(false);
        onConfigFile(config);
      } catch (e) {
        setError(true);
        console.error(e);
      }
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
      <div className={className}>
        <Wrapper>
          <Title className="text-grey-dark">Upload Configuration File</Title>
          {errorMessage && (
            <div className="my-2">
              <ErrorAlert message={errorMessage} />
            </div>
          )}
          <div {...getRootProps()}>
            <input data-testid="config-file-drop-zone" {...getInputProps()} />
            <div
              className={`border-dashed border-2 items-center border-grey-lighter flex flex-col pt-16 pb-16 px-4 text-center ${
                isDragActive ? "bg-grey-lighter" : "bg-white"
              }`}
            >
              {error && <div>Error: File cannot be read</div>}
              <div className="dropText text-grey-dark">Drag and drop file here</div>
              <div className="text-base text-grey-dark my-4">or</div>
              <Button className="py-3 px-12 bg-white text-orange hover:text-orange-dark">
                Browse File
              </Button>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }
)`
  .dropText {
    ${mixin.fontRobotoBold()}
    ${mixin.fontSize(18)}
  }
`;
