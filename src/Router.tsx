import React, { ReactElement } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Help } from "./views/Help";
import { Home } from "./views/Home";

export const Router = (): ReactElement => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/help">
          <Help />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
