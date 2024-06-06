import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { decryptWalletOrSigner } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { WalletDecryption } from "./WalletDecryption";
import { getLogger } from "../../../utils/logger";
import { DEMO_PASSWD } from "../../../constants/demo-config";

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
  useEffect(() => {
    if (isDemo && configFile) {
      onDecryptConfigFile(DEMO_PASSWD);
    }
  }, [isDemo, configFile, onDecryptConfigFile]);
  return (
    <WalletDecryption
      decryptProgress={decryptProgress}
      isIncorrectPassword={isIncorrectPassword}
      onDecryptConfigFile={onDecryptConfigFile}
      onResetConfigFile={onResetConfigFile}
    />
  );
};
