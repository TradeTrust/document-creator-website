import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { NavigationBar } from "../NavigationBar";
import { DynamicFormLayout } from "./DynamicFormLayout";

export const DynamicFormContainer: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();

  const logout = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  if (!config) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <NavigationBar logout={logout} />
      <DynamicFormLayout />
    </>
  );
};
