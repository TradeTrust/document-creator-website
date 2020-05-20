import styled from "@emotion/styled";
import React from "react";
import { Config, Form } from "../../../types";
import { Button } from "../../../UI/Button";
import { Title } from "../../../UI/Title";
import { Container } from "../../Container";

interface FormSelection {
  config: Config;
}

export const FormSelection = styled(({ className, config }) => {
  console.log("config", config);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const selectedForm = (form: string) => {
    console.log(form);
  };

  return (
    <Container>
      <div className={className}>
        <div className="wrapper">
          <Title>Choose Document Type to Issue</Title>
          {/* <div>Wallet Address: {config.wallet.address}</div> */}
          <div className="buttonWrapper">
            {config.forms.map((form: Form, i: number) => {
              return (
                <Button key={i} onClick={() => selectedForm(form.name)}>
                  {form.name}
                </Button>
              );
            })}
          </div>
          <div className="or-word">or</div>
          <Button onClick={() => selectedForm("Basic Template")}>Use a Basic Template</Button>
        </div>
      </div>
    </Container>
  );
})`
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 600px;
    margin: auto;
    padding-top: 32px;
  }

  .buttonWrapper {
    display: flex;
    width: 100%;
  }

  .or-word {
    width: 100%;
    text-align: center;
    margin: 32px 0;
  }
`;
