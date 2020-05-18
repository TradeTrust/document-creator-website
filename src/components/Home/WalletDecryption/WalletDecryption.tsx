import React, { useState, FunctionComponent } from "react";

interface WalletDecryption {
  isDecrypting: boolean;
  onDecryptConfigFile: (password: string) => void;
  onResetConfigFile: () => void;
}

export const WalletDecryption: FunctionComponent<WalletDecryption> = ({
  isDecrypting,
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
      <input
        className="w-full"
        type="password"
        value={password}
        onChange={(evt) => setPassword(evt.target.value)}
        disabled={isDecrypting}
      />
      <div>
        <button onClick={onLogin} disabled={isDecrypting}>
          Login
        </button>
      </div>
      <div>
        <button onClick={onResetConfigFile}>Use another config file</button>
      </div>
    </>
  );
};
