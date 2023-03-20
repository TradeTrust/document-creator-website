import { NetworkBar, Overlay } from "@govtechsg/tradetrust-ui-components";
import { Router } from "react-router-dom";
import { useConfigContext } from "./common/context/config";
import { useFormsContext } from "./common/context/forms";
import { usePersistedConfigFile } from "./common/hook/usePersistedConfigFile";
import { NavigationBar } from "./components/NavigationBar";
import { FooterBar } from "./components/FooterBar";
import { SessionTimeout } from "./components/SessionTimeout";
import { routes, Routes } from "./routes";
import { history } from "./history";

export const App: React.FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  const { setConfig, config } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();

  const logout = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  return (
    <>
      <NetworkBar network="token-registry-v4">
        Token Registry V2 has been deprecated, update your config files with Token Registry V4 address
      </NetworkBar>
      <NetworkBar network={configFile?.network}>
        You are currently on <span className="capitalize">{configFile?.network}</span> network. To change it, please
        upload a new config file.
      </NetworkBar>
      <Router history={history}>
        <main className="bg-cerulean-50 bg-cover" style={{ backgroundImage: "url(/wave-lines.png)" }}>
          <NavigationBar logout={config ? logout : undefined} />
          <Routes routes={routes} />
        </main>
        <FooterBar />
      </Router>
      {config && <SessionTimeout logout={logout} />}
      <Overlay />
    </>
  );
};
