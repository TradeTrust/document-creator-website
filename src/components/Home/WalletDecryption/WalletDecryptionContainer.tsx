import React, { FunctionComponent, useState } from "react";
import { decryptWallet } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { WalletDecryption } from "./WalletDecryption";

export const WalletDecryptionContainer: FunctionComponent = () => {
  const { setConfig } = useConfigContext();
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const { configFile, setConfigFile } = usePersistedConfigFile();
  const [decryptProgress, setDecryptProgress] = useState<number>(0);

  const onResetConfigFile = (): void => {
    setConfigFile();
  };

  const onDecryptConfigFile = async (password: string): Promise<void> => {
    if (!configFile) return;
    try {
      setIsIncorrectPassword(false);
      const wallet = await decryptWallet(configFile, password, (progress) => {
        setDecryptProgress(progress);
      });
      setConfig({
        network: configFile.network,
        wallet,
        forms: configFile.forms,
        documentStorage: configFile.documentStorage,
      });
    } catch (e) {
      setIsIncorrectPassword(true);
    }
  };

  return (
    <WalletDecryption
      decryptProgress={decryptProgress}
      isIncorrectPassword={isIncorrectPassword}
      onDecryptConfigFile={onDecryptConfigFile}
      onResetConfigFile={onResetConfigFile}
    />
  );
};
