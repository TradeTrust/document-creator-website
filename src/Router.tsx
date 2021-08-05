import { NetworkBar, Overlay } from "@govtechsg/tradetrust-ui-components";
import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useConfigContext } from "./common/context/config";
import { useFormsContext } from "./common/context/forms";
import { usePersistedConfigFile } from "./common/hook/usePersistedConfigFile";
import { AddressBookContainer } from "./components/AddressBookContainer";
import { AddressResolverContainer } from "./components/AddressResolverContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { HomeContainer } from "./components/Home";
import { NavigationBar } from "./components/NavigationBar";
import { PublishContainer } from "./components/PublishContainer";
import { SettingsContainer } from "./components/SettingsContainer";
import { PageNotFound } from "./pages/pageNotFound";
import { RevokeContainer } from "./components/RevokeContainer";

export const Router = (): ReactElement => {
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
      <NetworkBar network={configFile?.network}>
        You are currently on <span className="capitalize">{configFile?.network}</span> network. To change it, please
        upload a new config file.
      </NetworkBar>
      <BrowserRouter>
        <NavigationBar logout={config ? logout : undefined} />
        <main className="bg-blue-300">
          <Switch>
            <Route exact path="/">
              <HomeContainer />
            </Route>
            <Route path="/forms-selection">
              <FormSelectionContainer />
            </Route>
            <Route path="/form">
              <DynamicFormContainer />
            </Route>
            <Route path="/publish">
              <PublishContainer />
            </Route>
            <Route path="/settings/address-book">
              <AddressBookContainer />
            </Route>
            <Route path="/settings/address-resolver">
              <AddressResolverContainer />
            </Route>
            <Route path="/settings">
              <SettingsContainer />
            </Route>
            <Route path="/revoke">
              <RevokeContainer />
            </Route>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
      <Overlay />
    </>
  );
};
