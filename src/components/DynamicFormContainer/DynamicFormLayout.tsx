import { LoaderSpinner, ToggleSwitch } from "@tradetrust-tt/tradetrust-ui-components";
import { defaultsDeep } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Trash2 } from "react-feather";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { OnCloseGuard } from "../OnCloseGuard/OnCloseGuard";
import { Card } from "../UI/Card";
import { ContentFrame } from "../UI/ContentFrame";
import { AddFormModal } from "./AddFormModal";
import { BackModal } from "./BackModal";
import { DeleteModal } from "./DeleteModal";
import { DocumentPreview } from "./DocumentPreview";
import { DynamicForm } from "./DynamicForm";
import { DynamicFormHeader } from "./DynamicFormHeader";
import { FormErrorBanner } from "./FormErrorBanner";
import { validateData, getDataToValidate, hasVcContext, getDataV3 } from "./../../common/utils";
import { FormErrors } from "./../../types";

export const DynamicFormLayout: FunctionComponent = () => {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showAddFormModal, setShowAddFormModal] = useState(false);
  const [isSwitchingForm, setIsSwitchingForm] = useState(false);

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
    newForm,
  } = useFormsContext();
  const { config } = useConfigContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>(null);

  // if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;
  if (!currentFormTemplate) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const { schema: formSchema, uiSchema, fileName } = currentFormTemplate;
  const attachmentAccepted = !!currentFormTemplate.attachments?.allow;
  const attachmentAcceptedFormat = currentFormTemplate.attachments?.accept;

  const validateCurrentForm = (): boolean => {
    const dataToValidate = getDataToValidate(currentForm.data.formData);
    const { isValid, ajvErrors } = validateData(currentForm.data.schema, dataToValidate);
    setFormErrors(ajvErrors);
    return isValid;
  };

  const removeCurrentForm = (): void => {
    if (activeFormIndex === undefined) return;
    const nextForms = [...forms];
    nextForms.splice(activeFormIndex, 1);
    setForms(nextForms);
    if (nextForms.length === activeFormIndex) setActiveFormIndex(nextForms.length - 1);
  };

  const onNewForm = (): void => {
    if (validateCurrentForm()) {
      setShowAddFormModal(true);
    }
  };

  const onAddNewForm = (index: number): void => {
    if (validateCurrentForm()) {
      newForm(index);
      switchForm(400);
    }
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
    setFormErrors(null);
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

  const switchForm = (timeout: number): void => {
    setIsSwitchingForm(true);
    setTimeout(() => {
      setIsSwitchingForm(false);
    }, timeout);
  };

  const currentUnwrappedData = hasVcContext(currentForm.data.formData)
    ? defaultsDeep(
        {},
        {
          ...currentForm.data.formData,
          credentialSubject: getDataV3(currentForm.data.formData),
        },
        currentFormTemplate.defaults
      )
    : defaultsDeep({}, currentForm.data.formData, currentFormTemplate.defaults);

  return (
    <OnCloseGuard active={activeFormIndex !== undefined}>
      <DeleteModal deleteForm={deleteForm} show={showDeleteModal} closeDeleteModal={closeDeleteModal} />
      <BackModal backToFormSelection={deleteAllForms} show={showBackModal} closeBackModal={closeBackModal} />
      {config && (
        <AddFormModal
          forms={config.forms}
          onAdd={onAddNewForm}
          onClose={() => setShowAddFormModal(false)}
          show={showAddFormModal}
        />
      )}
      <DynamicFormHeader
        onBackToFormSelection={() => setShowBackModal(true)}
        onNewForm={onNewForm}
        onFormSubmit={onFormSubmit}
        validateCurrentForm={validateCurrentForm}
        closePreviewMode={closePreviewMode}
      />
      <div className="container">
        <ContentFrame>
          <Card>
            <div className="flex justify-between">
              <div className="text-cloud-800 flex items-center">
                <div className="align-middle mr-4">Preview mode:</div>
                <ToggleSwitch isOn={isPreviewMode} handleToggle={() => setIsPreviewMode(!isPreviewMode)} />
              </div>
              {forms.length > 1 && (
                <Trash2
                  className="cursor-pointer text-cerulean-300 hover:text-cerulean-500"
                  data-testid="delete-button"
                  onClick={() => setDeleteModal(true)}
                />
              )}
            </div>
            {isSwitchingForm ? (
              <LoaderSpinner className="flex mx-auto mt-4" />
            ) : (
              <>
                <FormErrorBanner
                  formErrorTitle="This form has errors. Please fix the errors to proceed."
                  formErrors={formErrors}
                />
                {isPreviewMode ? (
                  <div className="max-w-screen-xl mx-auto mt-6">
                    <DocumentPreview document={currentUnwrappedData} />
                  </div>
                ) : (
                  <DynamicForm
                    className="mt-6"
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
                )}
              </>
            )}
          </Card>
        </ContentFrame>
      </div>
    </OnCloseGuard>
  );
};
