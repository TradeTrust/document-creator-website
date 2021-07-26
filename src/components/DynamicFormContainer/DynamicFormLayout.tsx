import { ButtonIcon } from "@govtechsg/tradetrust-ui-components";
import Ajv, { ErrorObject } from "ajv";
import { defaultsDeep } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Trash2 } from "react-feather";
import { Redirect } from "react-router";
import { useFormsContext } from "../../common/context/forms";
import { ToggleSwitch } from "../UI/ToggleSwitch";
import { BackModal } from "./BackModal";
import { DeleteModal } from "./DeleteModal";
import { DocumentPreview } from "./DocumentPreview";
import { DynamicForm } from "./DynamicForm";
import { DynamicFormHeader } from "./DynamicFormHeader";
import { FormErrorBanner } from "./FormErrorBanner";

export const DynamicFormLayout: FunctionComponent = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const {
    forms,
    setForms,
    setActiveFormIndex,
    activeFormIndex,
    currentForm,
    currentFormTemplate,
    setCurrentFormData,
    setCurrentFormOwnership,
    setCurrentForm,
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<ErrorObject[] | null | undefined>(null);
  if (!currentForm) return <Redirect to="/forms-selection" />;
  if (!currentFormTemplate) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const { schema: formSchema, uiSchema, fileName } = currentFormTemplate;
  const attachmentAccepted = !!currentFormTemplate.attachments?.allow;
  const attachmentAcceptedFormat = currentFormTemplate.attachments?.accept;

  const validateCurrentForm = (): boolean => {
    const ajv = new Ajv();

    const validForm = ajv.validate(currentForm.data.schema, currentForm.data.formData);
    setFormError(ajv.errors);
    return validForm as boolean;
  };

  const removeCurrentForm = (): void => {
    if (activeFormIndex === undefined) return;
    const nextForms = [...forms];
    nextForms.splice(activeFormIndex, 1);
    setForms(nextForms);
    const nextActiveFormIndex =
      nextForms.length === activeFormIndex ? nextForms.length - 1 : nextForms.length > 0 ? activeFormIndex : undefined;
    setActiveFormIndex(nextActiveFormIndex);
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

  const closeBackModal = (): void => {
    setShowBackModal(false);
  };

  const closePreviewMode = (): void => {
    if (isPreviewMode) setIsPreviewMode(false);
  };

  const deleteAllForms = (): void => {
    setActiveFormIndex(undefined);
    setForms([]);
    closeBackModal();
  };

  const currentUnwrappedData = defaultsDeep({}, currentForm.data.formData, currentFormTemplate.defaults);

  return (
    <>
      <DeleteModal deleteForm={deleteForm} show={showDeleteModal} closeDeleteModal={closeDeleteModal} />
      <BackModal backToFormSelection={deleteAllForms} show={showBackModal} closeBackModal={closeBackModal} />
      <DynamicFormHeader
        onBackToFormSelection={() => setShowBackModal(true)}
        onNewForm={onNewForm}
        onFormSubmit={onFormSubmit}
        validateCurrentForm={validateCurrentForm}
        closePreviewMode={closePreviewMode}
      />
      <div className="bg-grey-100 py-6">
        <div className="container">
          <div className="bg-white p-4">
            <div className="flex justify-between">
              <div className="text-grey-800 flex items-center">
                <div className="align-middle">Preview mode:</div>
                <ToggleSwitch isOn={isPreviewMode} handleToggle={() => setIsPreviewMode(!isPreviewMode)} />
              </div>
              <ButtonIcon
                className="bg-white hover:bg-grey-100 border-grey-400"
                data-testid="delete-button"
                onClick={() => setDeleteModal(true)}
              >
                <Trash2 className="text-grey" />
              </ButtonIcon>
            </div>
            <FormErrorBanner
              formErrorTitle="This form has errors. Please fix the errors to proceed."
              formError={formError}
            />
            {isPreviewMode ? (
              <div className="max-w-screen-xl mx-auto mt-6">
                <DocumentPreview document={currentUnwrappedData} />
              </div>
            ) : (
              <div className="max-w-screen-sm mx-auto mt-6">
                <DynamicForm
                  schema={formSchema}
                  uiSchema={uiSchema}
                  form={currentForm}
                  type={currentFormTemplate.type}
                  setFormData={setCurrentFormData}
                  setOwnership={setCurrentFormOwnership}
                  setCurrentForm={setCurrentForm}
                  attachmentAccepted={attachmentAccepted}
                  attachmentAcceptedFormat={attachmentAcceptedFormat}
                  fileName={fileName}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
