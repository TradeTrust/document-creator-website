import React, { useState, FunctionComponent } from "react";
import { Container } from "../Container";
import { ConfigDropZone } from "../Dropzone/ConfigDropzone";
import { useConfigContext } from "../common/context/config";
import { assertConfigFile } from "../common/config/validate";
import { decryptWallet } from "../common/config/decrypt";
import { ConfigFile } from "../../types";
import { NavigationBar } from "../NavigationBar";

import createPersistedState from "use-persisted-state";
import { Redirect } from "react-router-dom";
const useConfigFile = createPersistedState("CONFIG_FILE");

export const DropZoneView = ({ onConfigFile }: { onConfigFile: (config: ConfigFile) => void }) => {
  return (
    <>
      <div className="py-3">
        <h1>Upload Configuration File</h1>
      </div>
      <ConfigDropZone onConfig={onConfigFile} />
    </>
  );
};

interface DecryptionView {
  isDecrypting: boolean;
  onDecryptConfigFile: (password: string) => void;
  onResetConfigFile: () => void;
}

export const DecryptionView: FunctionComponent<DecryptionView> = ({
  isDecrypting,
  onDecryptConfigFile,
  onResetConfigFile,
}) => {
  const [password, setPassword] = useState("");
  const onLogin = () => {
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
      ></input>
      <div>
        <button onClick={onLogin} disabled={isDecrypting}>
          Login
        </button>
      </div>
      <div>
        <button onClick={onResetConfigFile}>Use another account</button>
      </div>
    </>
  );
};

export const Home: React.FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Using empty object to initialize config file due to bug with deserializing "undefined"
  const [configFileFromStorage, setConfigFile] = useConfigFile<ConfigFile | {}>({});
  const configFile =
    Object.keys(configFileFromStorage).length === 0 ? undefined : (configFileFromStorage as ConfigFile);

  const onConfigFile = async (configFileFromDropZone: ConfigFile) => {
    assertConfigFile(configFileFromDropZone);
    setConfigFile(configFileFromDropZone);
  };
  const onResetConfigFile = () => {
    setConfigFile({});
  };

  const onDecryptConfigFile = async (password: string) => {
    if (!configFile) return;
    try {
      setIsDecrypting(true);
      const wallet = await decryptWallet(configFile.wallet, password);
      setIsDecrypting(false);
      setConfig({
        wallet,
      });
    } catch (e) {
      setIsDecrypting(false);
    }
  };

  if (config) return <Redirect to="/forms" />;

  return (
    <>
      <NavigationBar />
      <Container>
        {configFile ? (
          <DecryptionView
            isDecrypting={isDecrypting}
            onDecryptConfigFile={onDecryptConfigFile}
            onResetConfigFile={onResetConfigFile}
          />
        ) : (
          <DropZoneView onConfigFile={onConfigFile} />
        )}
      </Container>
    </>
  );
};
