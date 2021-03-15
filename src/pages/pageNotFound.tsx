import React, { FunctionComponent } from "react";
import { ErrorPage } from "../components/ErrorPage";

export const PageNotFound: FunctionComponent = () => {
  return <ErrorPage title="404" description="Oops, page not found" />;
};
