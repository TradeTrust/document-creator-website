import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { Config } from "../../types";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";

interface FormSelection {
  config: Config;
}

export const FormSelection: FunctionComponent<FormSelection> = ({ config }) => {
  return (
    <Container>
      <h1>Successfully decrypted wallet</h1>
      <div>Wallet Address: {config.wallet.address}</div>
    </Container>
  );
};

export const FormSelectionContainer: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const logout = (): void => setConfig(undefined);
  if (!config) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <NavigationBar logout={logout} />
      <FormSelection config={config} />
    </>
  );
};
