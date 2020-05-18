import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { FormSelectionContainer } from "./components/FormSelection";
import { HomeContainer } from "./components/Home";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <HomeContainer />
        </Route>
        <Route path="/forms">
          <FormSelectionContainer />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
