import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { PublishPage } from "./PublishPage";

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  if (!config) return <Redirect to="/" />;
  return <PublishPage config={config} />;
};
