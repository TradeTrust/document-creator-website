import { NetworkBar, Overlay } from "@govtechsg/tradetrust-ui-components";
import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { usePersistedConfigFile } from "./common/hook/usePersistedConfigFile";
import { AddressResolverContainer } from "./components/AddressResolverContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { HomeContainer } from "./components/Home";
import { PublishContainer } from "./components/PublishContainer";

export const Router = (): ReactElement => {
  const { configFile } = usePersistedConfigFile();

  return (
    <>
      <NetworkBar network={configFile?.network} />
      <main className="bg-blue-300">
        <BrowserRouter>
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
            <Route path="/settings">
              <AddressResolverContainer />
            </Route>
          </Switch>
        </BrowserRouter>
      </main>
      <Overlay />
    </>
  );
};
