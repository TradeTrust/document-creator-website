import createPersistedState from "use-persisted-state";
import { ConfigFile } from "../../../types";

const useConfigFile = createPersistedState("CONFIG_FILE");

export const usePersistedConfigFile = (): {
  configFile?: ConfigFile;
  setConfigFile: (configFile?: ConfigFile) => void;
} => {
  // Using empty object to initialize config file due to bug with deserializing "undefined"
  const [configFileFromStorage, setConfigFile] = useConfigFile<ConfigFile | {}>({});
  const configFile =
    Object.keys(configFileFromStorage).length === 0 ? undefined : (configFileFromStorage as ConfigFile);
  return { configFile, setConfigFile };
};
