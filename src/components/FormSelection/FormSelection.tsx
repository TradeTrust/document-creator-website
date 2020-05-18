import React from "react";
import { Container } from "../Container";
import { useConfigContext } from "../common/context/config";
import { Redirect } from "react-router";
import { NavigationBar } from "../NavigationBar";

export const FormSelection = () => {
  const { config, setConfig } = useConfigContext();
  const logout = () => setConfig(undefined);
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
