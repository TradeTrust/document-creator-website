import React, { useState, FunctionComponent } from "react";
import { decryptWallet } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { ErrorAlert } from "../../Alert";
interface WalletDecryption {
  isDecrypting: boolean;
  onDecryptConfigFile: (password: string) => void;
  onResetConfigFile: () => void;
  isIncorrectPassword: boolean;
}

export const WalletDecryption: FunctionComponent<WalletDecryption> = ({
  isDecrypting,
  isIncorrectPassword,
  onDecryptConfigFile,
  onResetConfigFile,
}) => {
  const [password, setPassword] = useState("");
  const onLogin = (): void => {
    onDecryptConfigFile(password);
  };

  return (
    <>
      <div className="py-3">
        <h1>Login</h1>
      </div>
      {isIncorrectPassword && (
        <div className="my-2">
          <ErrorAlert message="Password is incorrect" />
        </div>
      )}
      <input
        role="password-field"
        className="w-full"
        type="password"
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
        disabled={isDecrypting}
      />
      <div>
        <button role="login-button" onClick={onLogin} disabled={isDecrypting}>
          Login
        </button>
      </div>
      <div>
        <button role="reset-button" onClick={onResetConfigFile}>
          Use another config file
        </button>
      </div>
    </>
  );
};

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
      const wallet = await decryptWallet(configFile.wallet, password);
      setIsDecrypting(false);
      setConfig({
        wallet,
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
