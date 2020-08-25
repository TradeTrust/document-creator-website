import React, { FunctionComponent, useState } from "react";
import { decryptWallet } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { WalletDecryption } from "./WalletDecryption";

export const WalletDecryptionContainer: FunctionComponent = () => {
  const { setConfig } = useConfigContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const { configFile, setConfigFile } = usePersistedConfigFile();

  const onResetConfigFile = (): void => {
    setConfigFile();
  };

  const onDecryptConfigFile = async (password: string): Promise<void> => {
    if (!configFile) return;
    try {
      setIsIncorrectPassword(false);
      setIsDecrypting(true);
      const wallet = await decryptWallet(configFile, password);
      setIsDecrypting(false);
      setConfig({
        network: configFile.network,
        wallet,
        forms: configFile.forms,
        documentStorage: configFile.documentStorage,
      });
    } catch (e) {
      setIsIncorrectPassword(true);
      setIsDecrypting(false);
    }
  };

  return (
    <WalletDecryption
      isIncorrectPassword={isIncorrectPassword}
      isDecrypting={isDecrypting}
      onDecryptConfigFile={onDecryptConfigFile}
      onResetConfigFile={onResetConfigFile}
    />
  );
};
