import React, { ReactElement } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FormSelectionContainer } from "./components/FormSelectionContainer";
import { DynamicFormContainer } from "./components/DynamicFormContainer";
import { HomeContainer } from "./components/Home";

export const Router = (): ReactElement => {
  return (
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
      </Switch>
    </BrowserRouter>
  );
};
