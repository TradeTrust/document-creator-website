import React, { FunctionComponent, useState } from "react";
import { ArrowRight } from "react-feather";
import { assertConfigFile } from "../../../common/config/validate";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { ConfigFile } from "../../../types";
import { ContentFrame } from "../../UI/ContentFrame";
import { Wrapper } from "../../UI/Wrapper";
import { ConfigFileDropZone } from "./ConfigFileDropZone";

export const ConfigFileDropZoneContainer: FunctionComponent = () => {
  const [configValidationError, setConfigValidationError] = useState("");
  const { setConfigFile } = usePersistedConfigFile();

  const onConfigFile = async (configFileFromDropZone: ConfigFile): Promise<void> => {
    try {
      assertConfigFile(configFileFromDropZone);
      setConfigFile(configFileFromDropZone);
      setConfigValidationError("");
    } catch (e) {
      setConfigValidationError(`Config is malformed: ${e.message}`);
    }
  };

  return (
    <Wrapper>
      <ContentFrame>
        <ConfigFileDropZone errorMessage={configValidationError} onConfigFile={onConfigFile} />
        <a
          className="w-full h-12 bg-white mt-4 text-gray-800 px-3 flex items-center justify-between font-bold shadow-md rounded hover:shadow-lg"
          href="https://docs.tradetrust.io/docs/document-creator/config-file"
          target="_blank"
          rel="noopener noreferrer"
        >
          Don’t have a config file? Learn how to create one
          <ArrowRight />
        </a>
      </ContentFrame>
    </Wrapper>
  );
};
