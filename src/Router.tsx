import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { FormSelection } from "./components/FormSelection";
import { Home } from "./components/Home";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/forms">
          <FormSelection />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
