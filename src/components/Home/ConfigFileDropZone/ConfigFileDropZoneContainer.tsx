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
      </ContentFrame>
    </Wrapper>
  );
};
