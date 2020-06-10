import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";
import { useActiveFormContext } from "../../common/context/activeForm";
import { useConfigContext } from "../../common/context/config";
import { SvgIcon, SvgIconArrowLeft } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { ToggleSwitch } from "../../UI/ToggleSwitch";
import { Container } from "../Container";
import { ProgressBar } from "../ProgressBar";
import { DynamicForm } from "./DynamicForm";

export const DynamicFormLayout: FunctionComponent = () => {
  const { config } = useConfigContext();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { activeFormIndex, setActiveFormIndex } = useActiveFormContext();
  if (activeFormIndex === undefined) return <Redirect to="/forms-selection" />;
  const activeForm = config?.forms[activeFormIndex];
  if (!activeForm) return <Redirect to="/forms-selection" />;

  const onBackToFormSelection = (): void => {
    setActiveFormIndex(undefined);
  };

  return (
    <Container>
      <div className="container mx-auto">
        <div
          onClick={onBackToFormSelection}
          className="text-grey flex cursor-pointer py-4"
          data-testid="back-button"
        >
          <SvgIcon>
            <SvgIconArrowLeft />
          </SvgIcon>
          <div className="pl-2">Back</div>
        </div>
        <ProgressBar step={2} />
        <Title>Fill and Preview Form</Title>
      </div>
      <div className="bg-white-dark p-6">
        <div className="bg-white container mx-auto p-4">
          <div className="text-grey-dark flex items-center">
            <div className="align-middle">Preview mode:</div>
            <ToggleSwitch
              isOn={isPreviewMode}
              handleToggle={() => setIsPreviewMode(!isPreviewMode)}
            />
          </div>
          <div className="max-w-screen-sm mx-auto mt-6">
            <DynamicForm form={activeForm} handleSubmit={console.log} />
          </div>
        </div>
      </div>
    </Container>
  );
};
