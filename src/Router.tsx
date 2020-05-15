import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Home } from "./views/Home";
import { Help } from "./views/Help";

export const Router = () => {
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
