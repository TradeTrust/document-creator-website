import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { BarTrack } from "../../ProgressBar";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";

interface WalletDecryption {
  decryptProgress: number;
  onDecryptConfigFile: (password: string) => void;
  onResetConfigFile: () => void;
  isIncorrectPassword: boolean;
}

export const WalletDecryption: FunctionComponent<WalletDecryption> = ({
  decryptProgress,
  isIncorrectPassword,
  onDecryptConfigFile,
  onResetConfigFile,
}) => {
  const [password, setPassword] = useState("");
  const onLogin = (event: React.SyntheticEvent): void => {
    onDecryptConfigFile(password);
    event.preventDefault();
  };
  const isDecrypting = decryptProgress > 0 && decryptProgress < 1;

  const inputBorderCSS = isIncorrectPassword
    ? "w-full border-solid border border-red h-10 p-3"
    : "w-full border-solid border border-gray-300 h-10 p-3";

  return (
    <Wrapper isMaxW={true}>
      <Title className="mb-8">Create Document</Title>
      <form className="relative bg-white flex flex-col rounded pt-5 pl-5 pr-4 pb-6">
        {isDecrypting && <BarTrack progress={decryptProgress} className="absolute top-0 left-0" />}
        <div className="text-gray-800 mr-4 mb-4 font-bold text-lg" data-testid="login-title">
          Login
        </div>
        <input
          data-testid="password-field"
          placeholder="Enter password"
          className={`
              ${inputBorderCSS}
              ${isDecrypting && "bg-grey-300"}
              ${!password && "italic"}
            `}
          type="password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
          disabled={isDecrypting}
          autoComplete="off"
        />
        {isIncorrectPassword && (
          <div data-testid="password-field-msg" className="text-rose text-sm mt-2">
            Invalid password. Please try again.
          </div>
        )}
        <div data-testid="reset-button" className="text-blue font-bold mt-4 cursor-pointer" onClick={onResetConfigFile}>
          Upload new Config file
        </div>
        <div className="ml-auto w-auto">
          <Button
            data-testid="login-button"
            className="bg-orange-300 text-white hover:bg-orange-600 mt-4"
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
