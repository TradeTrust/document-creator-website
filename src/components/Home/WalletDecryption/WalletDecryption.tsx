import React, { FunctionComponent, useState } from "react";
import { Button } from "../../UI/Button";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";

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
      <Title className="mb-8">Create Document</Title>
      <form className="bg-white flex flex-col rounded pt-5 pl-5 pr-4 pb-6">
        <div className="text-grey-dark mr-4 mb-4 font-bold text-lg" data-testid="login-title">
          Login
        </div>
        <input
          data-testid="password-field"
          placeholder="Enter metawallet password"
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
          Upload new Config file
        </div>
        <Button
          data-testid="login-button"
          className="bg-orange text-white self-end py-3 px-4 mt-4"
          onClick={onLogin}
          disabled={isDecrypting}
        >
          Login
        </Button>
      </form>
    </Wrapper>
  );
};
