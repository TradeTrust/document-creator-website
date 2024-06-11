import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZone";
import { WalletDecryptionContainer } from "./WalletDecryption/WalletDecryptionContainer";

export const HomeContainer: FunctionComponent = () => {
  const { config, isDemo } = useConfigContext();
  const { configFile } = usePersistedConfigFile();
  console.log(`Isdemo from Home Container: ${isDemo}`);
  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms-selection" />;

  return configFile ? <WalletDecryptionContainer /> : <ConfigFileDropZoneContainer />;
};
