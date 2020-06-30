import Ajv from "ajv";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconArrowLeft, SvgIconTrash } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { ToggleSwitch } from "../../UI/ToggleSwitch";
import { Container } from "../Container";
import { ProgressBar } from "../ProgressBar";
import { DynamicForm } from "./DynamicForm";

export const DynamicFormLayout: FunctionComponent = () => {
  const { config } = useConfigContext();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const {
    forms,
    setForms,
    setActiveFormIndex,
    currentFormData,
    currentForm,
    setCurrentFormData,
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  if (!currentForm) return <Redirect to="/forms-selection" />;
  const formSchema = config?.forms[currentForm?.templateIndex].schema;
  if (!formSchema) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const validateCurrentForm = (): void => {
    // TODO validate current form
    // This should block transition to new form or publish page when validation fail for this form
    console.log(forms);

    const ajv = new Ajv();
    forms.forEach((form) => {
      const validForm = ajv.validate(form.data.schema, form.data.formData);
      if (!validForm) return console.log(ajv.errors);
    });
  };

  const removeCurrentForm = (): void => {
    // Remove current form data before going back
    const nextForms = [...forms];
    nextForms.splice(nextForms.length - 1, 1);
    setForms(nextForms);
    setActiveFormIndex(undefined);
  };

  const onBackToFormSelection = (): void => {
    removeCurrentForm();
  };

  const onNewForm = (): void => {
    validateCurrentForm();
    setActiveFormIndex(undefined);
  };

  const onFormSubmit = (): void => {
    validateCurrentForm();
    setIsSubmitted(true);
  };

  const deleteForm = (): void => {
    removeCurrentForm();
  };

  return (
    <Container>
      <div className="container mx-auto">
        <div
          onClick={onBackToFormSelection}
          className="text-grey flex cursor-pointer py-4 w-20"
          data-testid="back-button"
        >
          <SvgIcon>
            <SvgIconArrowLeft />
          </SvgIcon>
          <div className="pl-2">Back</div>
        </div>
        <ProgressBar step={2} />
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <Title className="mb-6">Fill and Preview Form</Title>
          </div>
          <div>
            <Button className="bg-white text-orange px-4 py-3 mb-6" onClick={onNewForm}>
              Add New
            </Button>
            <Button className="bg-orange text-white self-end py-3 px-4 mb-6" onClick={onFormSubmit}>
              Issue Document
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white-dark p-6">
        <div className="bg-white container mx-auto p-4">
          <div className="flex justify-between">
            <div className="text-grey-dark flex items-center">
              <div className="align-middle">Preview mode:</div>
              <ToggleSwitch
                isOn={isPreviewMode}
                handleToggle={() => setIsPreviewMode(!isPreviewMode)}
              />
            </div>
            <Button onClick={deleteForm}>
              <div className="rounded w-12 h-12 border border-solid border-lightgrey flex items-center justify-center">
                <SvgIcon className="text-lightgrey-dark">
                  <SvgIconTrash />
                </SvgIcon>
              </div>
            </Button>
          </div>
          <div className="max-w-screen-sm mx-auto mt-6">
            <DynamicForm
              schema={formSchema}
              formData={currentFormData}
              setFormData={setCurrentFormData}
              form={currentForm}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
