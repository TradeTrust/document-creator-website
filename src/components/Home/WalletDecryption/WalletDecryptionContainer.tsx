import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { decryptWalletOrSigner } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { WalletDecryption } from "./WalletDecryption";
import { getLogger } from "../../../utils/logger";
import { loadDemoWallet } from "./loadDemoWallet";

const { stack } = getLogger("Wallet Decryption Container");

export const WalletDecryptionContainer: FunctionComponent = () => {
  const { setConfig, isDemo } = useConfigContext();
  const [isIncorrectPassword, setIsIncorrectPassword] = useState(false);
  const { configFile, setConfigFile } = usePersistedConfigFile();
  const [decryptProgress, setDecryptProgress] = useState<number>(0);

  const onResetConfigFile = (): void => {
    setConfigFile();
  };

  const onDecryptConfigFile = useCallback(
    async (password: string): Promise<void> => {
      if (!configFile) return;
      try {
        setIsIncorrectPassword(false);
        const walletOrSigner = await decryptWalletOrSigner(configFile, password, (progress) => {
          setDecryptProgress(progress);
        });
        setConfig({
          network: configFile.network,
          wallet: walletOrSigner,
          forms: configFile.forms,
          documentStorage: configFile.documentStorage,
        });
      } catch (e) {
        if (e instanceof Error) {
          setIsIncorrectPassword(true);
          stack(e);
        }
      }
    },
    [configFile, setConfig, setDecryptProgress, setIsIncorrectPassword]
  );

  const loadDemo = useCallback(async (): Promise<void> => {
    // use demo wallet and config
    if (configFile) {
      const walletOrSigner = await loadDemoWallet(configFile);
      setConfig({
        network: configFile.network,
        wallet: walletOrSigner,
        forms: configFile.forms,
        documentStorage: configFile.documentStorage,
      });
    }
  }, [configFile, setConfig]);

  useEffect(() => {
    if (isDemo && configFile) {
      loadDemo();
    }
  }, [loadDemo, isDemo, configFile]);
  return (
    <>
      <b>{decryptProgress}</b>
      <WalletDecryption
        decryptProgress={decryptProgress}
        isIncorrectPassword={isIncorrectPassword}
        onDecryptConfigFile={onDecryptConfigFile}
        onResetConfigFile={onResetConfigFile}
      />
    </>
  );
};
