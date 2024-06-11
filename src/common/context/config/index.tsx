import React, { useState, useContext, createContext, FunctionComponent } from "react";
import { Config } from "../../../types";

interface ConfigContext {
  config?: Config;
  setConfig: (config?: Config) => void;
  isDemo: boolean;
  setIsDemo: (isDemo: boolean) => void;
}

export const ConfigContext = createContext<ConfigContext>({
  config: undefined,
  setConfig: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  isDemo: false,
  setIsDemo: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useConfigContext = (): ConfigContext => useContext<ConfigContext>(ConfigContext);

export const ConfigContextProvider: FunctionComponent = ({ children }) => {
  const [config, setConfig] = useState<Config>();
  const [isDemo, setIsDemo] = useState<boolean>(false);
  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        isDemo,
        setIsDemo,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
