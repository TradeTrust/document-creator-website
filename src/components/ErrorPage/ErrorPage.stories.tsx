import { createBrowserHistory } from "history";
import React, { FunctionComponent } from "react";
import { Router } from "react-router-dom";
import { ErrorPage } from "./ErrorPage";

export default {
  title: "Error/ErrorPage",
  component: ErrorPage,
  parameters: {
    componentSubtitle: "General error page",
  },
};

const history = createBrowserHistory();

export const Default: FunctionComponent = () => {
  return (
    <Router history={history}>
      <ErrorPage title="ERROR" description="Something went wrong" />
    </Router>
  );
};
