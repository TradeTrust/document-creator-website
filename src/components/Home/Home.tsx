import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZone";
import { WalletDecryptionContainer } from "./WalletDecryption";

export const HomeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { configFile } = usePersistedConfigFile();

  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms" />;

  return (
    <>
      <NavigationBar />
      <Container>
        {configFile ? <WalletDecryptionContainer /> : <ConfigFileDropZoneContainer />}
      </Container>
    </>
  );
};
