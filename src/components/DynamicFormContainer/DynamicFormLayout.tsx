import React, { FunctionComponent } from "react";
import { Redirect } from "react-router";
import { Container } from "../Container";
import { useActiveFormContext } from "../../common/context/activeForm";
import { useConfigContext } from "../../common/context/config";
import { DynamicForm } from "./DynamicForm";
import { Wrapper } from "../../UI/Wrapper";
import { ProgressBar } from "../ProgressBar";

export const DynamicFormLayout: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { activeFormIndex, setActiveFormIndex } = useActiveFormContext();
  if (activeFormIndex === undefined) return <Redirect to="/forms-selection" />;
  const activeForm = config?.forms[activeFormIndex];
  if (!activeForm) return <Redirect to="/forms-selection" />;

  const onBackToFormSelection = (): void => {
    setActiveFormIndex(undefined);
  };

  return (
    <Container>
      <Wrapper>
        <button onClick={onBackToFormSelection}>Back</button>
        <ProgressBar step={2} />
        <DynamicForm form={activeForm} />
      </Wrapper>
    </Container>
  );
};
