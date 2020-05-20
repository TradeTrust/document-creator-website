import styled from "@emotion/styled";
import React from "react";
import { Config, Form } from "../../../types";
import { Button } from "../../../UI/Button";
import { Title } from "../../../UI/Title";
import { Wrapper } from "../../../UI/Wrapper";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";

interface FormSelection {
  config: Config;
}

export const FormSelection = styled(({ className, config }) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const selectedForm = (form: string) => {
    console.log(form);
  };

  return (
    <Container>
      <div className={className}>
        <Wrapper>
          <ProgressBar step={2} />
          <Title>Choose Document Type to Issue</Title>
          <div className="buttonWrapper">
            {config.forms.map((form: Form, i: number) => {
              return (
                <Button
                  data-testid={`${form.type}-button`}
                  key={i}
                  onClick={() => selectedForm(form.name)}
                >
                  {form.name}
                </Button>
              );
            })}
          </div>
          <div className="or-word">or</div>
          <Button onClick={() => selectedForm("Basic Template")}>Use a Basic Template</Button>
        </Wrapper>
      </div>
    </Container>
  );
})`
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
