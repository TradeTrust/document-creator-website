import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";

export const FormSelection: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
  const logout = (): void => setConfig(undefined);
  if (!config) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <NavigationBar logout={logout} />
      <Container>
        <h1>Successfully decrypted wallet</h1>
        <div>Wallet Address: {config.wallet.address}</div>
      </Container>
    </>
  );
};
