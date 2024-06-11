import { NetworkBar, Overlay } from "@tradetrust-tt/tradetrust-ui-components";
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
  const { setConfig, config, setIsDemo, isDemo } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();
  const { setConfigFile } = usePersistedConfigFile();
  const logout = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
    if (isDemo) {
      setIsDemo(false);
      setConfigFile(undefined);
    }
  };

  return (
    <>
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
