import Ajv from "ajv";
import { cloneDeep, defaultsDeep } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconTrash, SvgIconXCircle } from "../../UI/SvgIcon";
import { ToggleSwitch } from "../../UI/ToggleSwitch";
import { Container } from "../Container";
import { DataFileButton } from "./DataFileButton";
import { DeleteModal } from "./DeleteModal";
import { DynamicForm } from "./DynamicForm";
import { DynamicFormHeader } from "./DynamicFormHeader";
import { TransferableRecordForm } from "./TransferableRecordForm";

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
    setCurrentFormOwnershipData,
  } = useFormsContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<Ajv.ErrorObject[] | null | undefined>();
  if (!currentForm) return <Redirect to="/forms-selection" />;
  const currentFormDefinition = config?.forms[currentForm?.templateIndex];
  if (!currentFormDefinition) return <Redirect to="/forms-selection" />;
  if (isSubmitted) return <Redirect to="/publish" />;

  const isTransferableRecord = currentFormDefinition.type === "TRANSFERABLE_RECORD";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFormValue = (value: any): void => {
    // Avoid using spread which will lazy copy the object
    // See discussion: https://github.com/rjsf-team/react-jsonschema-form/issues/306
    const nextFormData = cloneDeep(currentForm.data.formData);
    setCurrentFormData({ ...currentForm.data, formData: defaultsDeep(value, nextFormData) });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setAttachmentValue = (attachmentValue: any): void => {
    const currentFormData = cloneDeep(currentForm.data.formData);
    setCurrentFormData({
      ...currentForm.data,
      formData: { ...currentFormData, ...attachmentValue },
    });
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
            <Button data-testid="delete-button" onClick={() => setDeleteModal(true)}>
              <div className="rounded w-12 h-12 border border-solid border-lightgrey flex items-center justify-center">
                <SvgIcon className="text-lightgrey-dark">
                  <SvgIconTrash />
                </SvgIcon>
              </div>
            </Button>
          </div>
          {formError && formError.length > 0 && (
            <div className="bg-red-lighter rounded max-w-screen-sm mx-auto flex items-start py-3">
              <SvgIcon className="text-red mx-3 my-1">
                <SvgIconXCircle />
              </SvgIcon>
              <div className="text-red text-xl flex flex-col justify-center items-start">
                <div>This form has errors. Please fix the errors and submit again.</div>
                <ul className="list-disc pl-5">
                  {formError &&
                    formError.map((error, index: number) => {
                      return (
                        <li key={index}>
                          {error.dataPath} {error.message}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          )}
          <div className="max-w-screen-sm mx-auto mt-6">
            <div className="mb-10">
              <DataFileButton onDataFile={setFormValue} />
            </div>
            {isTransferableRecord && (
              <TransferableRecordForm
                beneficiaryAddress={currentForm.ownershipData.beneficiaryAddress}
                holderAddress={currentForm.ownershipData.holderAddress}
                setBeneficiaryAddress={(beneficiaryAddress) =>
                  setCurrentFormOwnershipData({
                    beneficiaryAddress,
                    holderAddress: currentForm.ownershipData.holderAddress,
                  })
                }
                setHolderAddress={(holderAddress) =>
                  setCurrentFormOwnershipData({
                    beneficiaryAddress: currentForm.ownershipData.beneficiaryAddress,
                    holderAddress,
                  })
                }
              />
            )}
            <DynamicForm
              schema={formSchema}
              formData={currentForm.data}
              setFormData={setCurrentFormData}
              attachmentAccepted={attachmentAccepted}
              attachmentAcceptedFormat={attachmentAcceptedFormat}
              setAttachmentValue={setAttachmentValue}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
