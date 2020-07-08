import Ajv from "ajv";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { Container } from "../Container";
import { Button } from "../UI/Button";
import { SvgIcon, SvgIconTrash } from "../UI/SvgIcon";
import { ToggleSwitch } from "../UI/ToggleSwitch";
import { DeleteModal } from "./DeleteModal";
import { DynamicForm } from "./DynamicForm";
import { DynamicFormHeader } from "./DynamicFormHeader";
import { FormErrorBanner } from "./FormErrorBanner";

export const DynamicFormLayout: FunctionComponent = () => {
  const { config } = useConfigContext();
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const {
    forms,
    setForms,
    setActiveFormIndex,
    currentForm,
    setCurrentFormData,
    setCurrentFormOwnership,
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<Ajv.ErrorObject[] | null | undefined>(null);
  if (!currentForm) return <Redirect to="/forms-selection" />;
  const currentFormDefinition = config?.forms[currentForm?.templateIndex];
  if (!currentFormDefinition) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const formSchema = currentFormDefinition.schema;
  const attachmentAccepted = !!currentFormDefinition.attachments?.allow;
  const attachmentAcceptedFormat = currentFormDefinition.attachments?.accept;

  const validateCurrentForm = (): boolean => {
    const ajv = new Ajv();

    const validForm = ajv.validate(currentForm.data.schema, currentForm.data.formData);
    setFormError(ajv.errors);
    return validForm as boolean;
  };

  const removeCurrentForm = (): void => {
    // Remove current form data before going back
    const nextForms = [...forms];
    nextForms.splice(nextForms.length - 1, 1);
    setForms(nextForms);
    setActiveFormIndex(undefined);
  };

  const onNewForm = (): void => {
    if (validateCurrentForm()) setActiveFormIndex(undefined);
  };

  const onFormSubmit = (): void => {
    if (validateCurrentForm()) setIsSubmitted(true);
  };

  const closeDeleteModal = (): void => {
    setDeleteModal(false);
  };

  const deleteForm = (): void => {
    removeCurrentForm();
    closeDeleteModal();
  };

  return (
    <Container>
      <DeleteModal
        deleteForm={deleteForm}
        show={showDeleteModal}
        closeDeleteModal={closeDeleteModal}
      />
      <DynamicFormHeader
        onBackToFormSelection={removeCurrentForm}
        onNewForm={onNewForm}
        onFormSubmit={onFormSubmit}
      />
      <div className="bg-lightgrey-lighter p-6">
        <div className="bg-white container mx-auto p-4">
          <div className="flex justify-between">
            <div className="text-grey-dark flex items-center">
              <div className="align-middle">Preview mode:</div>
              <ToggleSwitch
                isOn={isPreviewMode}
                handleToggle={() => setIsPreviewMode(!isPreviewMode)}
              />
            </div>
            <Button data-testid="delete-button" onClick={() => setDeleteModal(true)}>
              <div className="rounded w-12 h-12 border border-solid border-lightgrey flex items-center justify-center">
                <SvgIcon className="text-lightgrey-dark">
                  <SvgIconTrash />
                </SvgIcon>
              </div>
            </Button>
          </div>
          <FormErrorBanner formError={formError} />
          <div className="max-w-screen-sm mx-auto mt-6">
            <DynamicForm
              schema={formSchema}
              form={currentForm}
              type={currentFormDefinition.type}
              setFormData={setCurrentFormData}
              setOwnership={setCurrentFormOwnership}
              attachmentAccepted={attachmentAccepted}
              attachmentAcceptedFormat={attachmentAcceptedFormat}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
