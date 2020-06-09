import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { NavigationBar } from "../NavigationBar";

export const DynamicFormContainer: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const logout = (): void => setConfig(undefined);
  if (!config) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <NavigationBar logout={logout} />
    </>
  );
};
