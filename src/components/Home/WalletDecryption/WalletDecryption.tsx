import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent, useState } from "react";
import { BarTrack } from "../../ProgressBar";
import { Card } from "../../UI/Card";
import { Frame } from "../../UI/Frame";
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
    <Wrapper>
      <Title className="mb-8">Create and Revoke Document</Title>
      <Frame>
        <Card>
          <form className="relative">
            {isDecrypting && <BarTrack progress={decryptProgress} className="absolute top-0 left-0" />}
            <div className="text-cloud-900 mr-4 mb-4 text-2xl" data-testid="login-title">
              Login
            </div>
            <input
              data-testid="password-field"
              placeholder="Password"
              className={`
                ${inputBorderCSS}
                ${isDecrypting && "bg-gray-300"}
                ${!password && "italic"}
              `}
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              disabled={isDecrypting}
              autoComplete="off"
            />
            {isIncorrectPassword && (
              <div data-testid="password-field-msg" className="text-red-500 text-sm mt-2">
                Invalid password. Please try again.
              </div>
            )}
            <div
              data-testid="reset-button"
              className="text-cerulean-200 font-bold mt-4 cursor-pointer mb-6"
              onClick={onResetConfigFile}
            >
              Upload a new Config file
            </div>
            <div className="w-auto">
              <Button
                data-testid="login-button"
                className="bg-cerulean text-white hover:bg-blue-600 mt-4 hover:bg-cerulean-500"
                onClick={onLogin}
                disabled={isDecrypting}
              >
                Login
              </Button>
            </div>
          </form>
        </Card>
      </Frame>
    </Wrapper>
  );
};
