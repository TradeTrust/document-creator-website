import React, { FunctionComponent } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";
import { useFormsContext } from "../../common/context/forms";

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { forms } = useFormsContext();

  // If wallet has been decrypted, redirect to forms
  // if (config) return <Redirect to="/forms-selection" />;

  return (
    <>
      <NavigationBar />
      <Container>
        <h1>Publishing {forms.length} Documents!</h1>
        <small>{JSON.stringify(forms)}</small>
      </Container>
    </>
  );
};
