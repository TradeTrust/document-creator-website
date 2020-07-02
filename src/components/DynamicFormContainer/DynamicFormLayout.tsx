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
import { ModalDialog } from "../ModalDialog";
import { ProgressBar } from "../ProgressBar";
import { DynamicForm } from "./DynamicForm";

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
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  if (!currentForm) return <Redirect to="/forms-selection" />;
  const currentFormDefinition = config?.forms[currentForm?.templateIndex];
  if (!currentFormDefinition) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const formSchema = currentFormDefinition.schema;
  const attachmentAccepted = !!currentFormDefinition.attachments?.allow;
  const attachmentAcceptedFormat = currentFormDefinition.attachments?.accept;

  const validateCurrentForm = (): boolean[] => {
    const ajv = new Ajv();
    const error = [] as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    forms.forEach((form) => {
      const validForm = ajv.validate(form.data.schema, form.data.formData);
      if (!validForm) {
        setFormError(true);
        console.error(ajv.errors);
        error.push(true);
      }
      setFormError(false);
      error.push(false);
    });
    return error;
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
    const anyError = validateCurrentForm().includes(true);
    !anyError && setActiveFormIndex(undefined);
  };

  const onFormSubmit = (): void => {
    const anyError = validateCurrentForm().includes(true);
    !anyError && setIsSubmitted(true);
  };

  const deleteForm = (): void => {
    removeCurrentForm();
    closeDeleteModal();
  };

  const closeDeleteModal = (): void => {
    setDeleteModal(false);
  };

  return (
    <Container>
      <ModalDialog show={showDeleteModal} close={closeDeleteModal}>
        <div className="flex flex-col ">
          <div className="text-2xl text-grey-dark font-bold">Delete Form</div>
          <div className="text-grey-dark mt-4 mr-16">
            Are you sure you want to delete this form?
          </div>
          <div className="mt-16">
            <div className="flex justify-end">
              <Button
                className="py-3 px-4 text-grey border border-solid border-lightgrey"
                onClick={closeDeleteModal}
                data-testid="cancel-form-button"
              >
                Cancel
              </Button>
              <Button className="py-3 px-4 text-white bg-red" onClick={deleteForm}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </ModalDialog>
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
        {formError && (
          <div className="text-red text-xl text-center mb-4">
            There seem to be an error in the form, please check the fields before issuing.
          </div>
        )}
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
          <div className="max-w-screen-sm mx-auto mt-6">
            <DynamicForm
              schema={formSchema}
              formData={currentForm.data}
              setFormData={setCurrentFormData}
              attachmentAccepted={attachmentAccepted}
              attachmentAcceptedFormat={attachmentAcceptedFormat}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
