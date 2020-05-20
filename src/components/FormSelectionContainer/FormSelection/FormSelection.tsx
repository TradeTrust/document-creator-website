import styled from "@emotion/styled";
import React from "react";
import { vars } from "../../../styles";
import { Config, Form } from "../../../types";
import { Container } from "../../Container";

interface FormSelection {
  config: Config;
}

export const FormSelection = styled(({ className, config }) => {
  console.log("config", config);

  const selectedForm = (form: string) => {
    console.log(form);
  };

  return (
    <Container>
      <div className={className}>
        <div className="wrapper">
          <p className="title">Choose Document Type to Issue</p>
          {/* <div>Wallet Address: {config.wallet.address}</div> */}
          <div className="buttonWrapper">
            {config.forms.map((form: Form, i: number) => {
              return (
                <button className="button" key={i} onClick={() => selectedForm(form.name)}>
                  {form.name}
                </button>
              );
            })}
          </div>
          <div className="or-word">or</div>
          <button className="button" onClick={() => selectedForm("Basic Template")}>
            Use a Basic Template
          </button>
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

  .title {
    font-weight: bold;
    font-size: 28px;
    color: ${vars.greyDark};
    margin-bottom: 32px;
  }

  .buttonWrapper {
    display: flex;
    width: 100%;
  }

  .button {
    color: ${vars.greyDark};
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    background-color: ${vars.white};
    font-weight: bold;
    font-size: 18px;
    padding: 16px;
    width: 100%;
    margin-left: 8px;
    margin-right: 8px;

    &:not(:disabled):not(.disabled):active,
    &:focus,
    &.focus,
    &:hover,
    &:active,
    &.active {
      color: ${vars.blue};
      box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
    }

    :first-of-type {
      margin-left: 0;
    }

    :last-child {
      margin-right: 0;
    }
  }

  .or-word {
    width: 100%;
    text-align: center;
    margin: 32px 0;
  }
`;
