import Ajv from "ajv";
import { defaultsDeep } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";
import { useFormsContext } from "../../common/context/forms";
import { Container } from "../Container";
import { Button } from "../UI/Button";
import { SvgIcon, SvgIconTrash } from "../UI/SvgIcon";
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
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<Ajv.ErrorObject[] | null | undefined>(null);
  if (!currentForm) return <Redirect to="/forms-selection" />;
  if (!currentFormTemplate) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const { schema: formSchema } = currentFormTemplate;
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
    const nextActiveFormIndex = nextForms.length > 0 ? nextForms.length - 1 : undefined;
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

  const deleteAllForms = (): void => {
    setActiveFormIndex(undefined);
    setForms([]);
    closeBackModal();
  };

  const currentUnwrappedData = defaultsDeep(
    {},
    currentForm.data.formData,
    currentFormTemplate.defaults
  );

  return (
    <Container>
      <DeleteModal
        deleteForm={deleteForm}
        show={showDeleteModal}
        closeDeleteModal={closeDeleteModal}
      />
      <BackModal
        backToFormSelection={deleteAllForms}
        show={showBackModal}
        closeBackModal={closeBackModal}
      />
      <DynamicFormHeader
        onBackToFormSelection={() => setShowBackModal(true)}
        onNewForm={onNewForm}
        onFormSubmit={onFormSubmit}
        validateCurrentForm={validateCurrentForm}
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
          {isPreviewMode ? (
            <div className="max-w-screen-xl mx-auto mt-6">
              <DocumentPreview document={currentUnwrappedData} />
            </div>
          ) : (
            <div className="max-w-screen-sm mx-auto mt-6">
              <DynamicForm
                schema={formSchema}
                form={currentForm}
                forms={forms}
                type={currentFormTemplate.type}
                setForms={setForms}
                setFormData={setCurrentFormData}
                setOwnership={setCurrentFormOwnership}
                attachmentAccepted={attachmentAccepted}
                attachmentAcceptedFormat={attachmentAcceptedFormat}
              />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
