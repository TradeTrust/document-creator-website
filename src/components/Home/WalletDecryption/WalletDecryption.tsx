import React, { FunctionComponent, useState } from "react";
import { decryptWallet } from "../../../common/config/decrypt";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { Button } from "../../../UI/Button";
import { Title } from "../../../UI/Title";
import { Wrapper } from "../../../UI/Wrapper";

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
  const onLogin = (event: React.SyntheticEvent): void => {
    onDecryptConfigFile(password);
    event.preventDefault();
  };

  const inputBorderCSS = isIncorrectPassword
    ? "w-full border-solid border border-red h-10 p-3"
    : "w-full border-solid border border-grey-lighter h-10 p-3";

  return (
    <Wrapper>
      <Title>Login with Password</Title>
      <form className="bg-white flex rounded pt-5 pl-5 pr-4 pb-6">
        <div className="text-grey-dark mr-4 mt-2 font-medium">Password</div>
        <div className="w-full flex flex-col items-start">
          <input
            data-testid="password-field"
            placeholder="Enter Password"
            className={`
              ${inputBorderCSS}
              ${isDecrypting && "bg-grey-lighter"}
              ${!password && "italic"}
            `}
            type="password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            disabled={isDecrypting}
          />
          {isIncorrectPassword && (
            <div data-testid="password-field-msg" className="text-red text-sm mt-2">
              Invalid password. Please try again.
            </div>
          )}
          <div
            data-testid="reset-button"
            className="text-blue font-bold mt-4 cursor-pointer"
            onClick={onResetConfigFile}
          >
            Use another Config file
          </div>
          <Button
            data-testid="login-button"
            className="bg-orange text-white self-end py-3 px-4 mt-4"
            onClick={onLogin}
            disabled={isDecrypting}
          >
            Login
          </Button>
        </div>
      </form>
    </Wrapper>
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
      const wallet = await decryptWallet(configFile, password);
      setIsDecrypting(false);
      setConfig({
        network: configFile.network,
        wallet,
        forms: configFile.forms,
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
