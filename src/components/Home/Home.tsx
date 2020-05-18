import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { decryptWallet } from "../../common/config/decrypt";
import { assertConfigFile } from "../../common/config/validate";
import { useConfigContext } from "../../common/context/config";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { ConfigFile } from "../../types";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
import { WalletDecryption } from "./WalletDecryption";

export const Home: React.FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const { configFile, setConfigFile } = usePersistedConfigFile();

  const onConfigFile = async (configFileFromDropZone: ConfigFile): Promise<void> => {
    assertConfigFile(configFileFromDropZone);
    setConfigFile(configFileFromDropZone);
  };

  const onResetConfigFile = (): void => {
    setConfigFile({});
  };

  const onDecryptConfigFile = async (password: string): Promise<void> => {
    if (!configFile) return;
    try {
      setIsDecrypting(true);
      const wallet = await decryptWallet(configFile.wallet, password);
      setIsDecrypting(false);
      setConfig({
        wallet,
      });
    } catch (e) {
      setIsDecrypting(false);
    }
  };

  // If wallet has been decrypted, redirect to forms
  if (config) return <Redirect to="/forms" />;

  return (
    <>
      <NavigationBar />
      <Container>
        {configFile ? (
          <WalletDecryption
            isDecrypting={isDecrypting}
            onDecryptConfigFile={onDecryptConfigFile}
            onResetConfigFile={onResetConfigFile}
          />
        ) : (
          <ConfigFileDropZone onConfigFile={onConfigFile} />
        )}
      </Container>
    </>
  );
};
