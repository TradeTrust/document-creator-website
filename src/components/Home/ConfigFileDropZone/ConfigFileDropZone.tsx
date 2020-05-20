import styled from "@emotion/styled";
import React, { FunctionComponent, useState } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { vars } from "../../../styles";
import { ConfigFile } from "../../../types";
import { ButtonSolidWhiteOrange } from "../../../UI/Button";
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
          <Title>Upload Configuration File</Title>
          {errorMessage && (
            <div className="my-2">
              <ErrorAlert message={errorMessage} />
            </div>
          )}
          <div {...getRootProps()}>
            <input data-testid="config-file-drop-zone" {...getInputProps()} />
            <div className={`dropZone ${isDragActive ? "bg-gray-400" : "bg-white"}`}>
              {error && <div>Error: File cannot be read</div>}
              <div className="dropText">Drag and drop file here</div>
              <div className="or">or</div>
              <ButtonSolidWhiteOrange className="browseButton">Browse File</ButtonSolidWhiteOrange>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }
)`
  .dropZone {
    border: 2px dashed #dddddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 62px;
    padding-bottom: 52px;
  }

  .dropText {
    font-weight: bold;
    font-size: 18px;
    color: ${vars.greyDark};
  }

  .or {
    font-size: 16px;
    margin: 24px 0;
  }

  .browseButton {
    padding: 13px 42px;
    font-weight: bold;
  }
`;
