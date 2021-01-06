import { NetworkBar, Overlay } from "@govtechsg/tradetrust-ui-components";
import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { usePersistedConfigFile } from "./common/hook/usePersistedConfigFile";
import { SettingsContainer } from "./components/SettingsContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { HomeContainer } from "./components/Home";
import { PublishContainer } from "./components/PublishContainer";
import { AddressBookContainer } from "./components/AddressBookContainer";
import { AddressResolverContainer } from "./components/AddressResolverContainer";
import { NavigationBar } from "./components/NavigationBar";
import { useConfigContext } from "./common/context/config";
import { useFormsContext } from "./common/context/forms";

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
        You are currently on <span className="capitalize">{configFile?.network}</span> network. To
        change it, please upload a new config file.
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
          </Switch>
        </main>
      </BrowserRouter>
      <Overlay />
    </>
  );
};
