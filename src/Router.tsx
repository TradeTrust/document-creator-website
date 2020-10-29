import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { PublishContainer } from "./components/PublishContainer";
import { HomeContainer } from "./components/Home";
import { NetworkBar } from "./components/UI/NetworkBar";
import { usePersistedConfigFile } from "./common/hook/usePersistedConfigFile";
import { Overlay } from "@govtechsg/tradetrust-ui-components";

export const Router = (): ReactElement => {
  const { configFile } = usePersistedConfigFile();

  return (
    <>
      <NetworkBar network={configFile?.network} />
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
        </Switch>
      </BrowserRouter>
      <Overlay />
    </>
  );
};
