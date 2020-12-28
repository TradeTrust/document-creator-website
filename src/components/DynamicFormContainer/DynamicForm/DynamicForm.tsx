import styled from "@emotion/styled";
import { cloneDeep, defaultsDeep } from "lodash";
import React, { FunctionComponent } from "react";
import JsonForm from "react-jsonschema-form";
import tw from "twin.macro";
import { mixin } from "../../../styles";
import { FileUploadType, FormEntry, FormTemplate, FormType, Ownership } from "../../../types";
import { DataFileButton } from "../DataFileButton";
import { TransferableRecordForm } from "../TransferableRecordForm";
import { AttachmentDropzone } from "./AttachmentDropzone";
import {
  CustomFieldTemplate,
  CustomObjectFieldTemplate,
  CustomTextareaWidget,
} from "./CustomTemplates";

export interface DynamicFormProps {
  schema: FormTemplate["schema"];
  attachmentAccepted: boolean;
  attachmentAcceptedFormat?: string;
  form: FormEntry;
  className?: string;
  type: FormType;
  setFormData: (formData: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  setOwnership: (ownership: Ownership) => void;
  setCurrentForm: (formData: any, ownership: Ownership) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const DynamicFormRaw: FunctionComponent<DynamicFormProps> = ({
  schema,
  form,
  setFormData,
  setOwnership,
  setCurrentForm,
  className,
  attachmentAccepted,
  type,
  attachmentAcceptedFormat = "",
}) => {
  const { data, ownership } = form;
  const isTransferableRecord = type === "TRANSFERABLE_RECORD";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeFormValue = (value: any): void => {
    // Avoid using spread which will lazy copy the object
    // See discussion: https://github.com/rjsf-team/react-jsonschema-form/issues/306
    const nextFormData = cloneDeep(data.formData);
    setCurrentForm(
      { ...data, formData: defaultsDeep(nextFormData, value?.data) },
      value?.ownership
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setAttachments = (attachments: any): void => {
    const currentFormData = cloneDeep(data.formData);
    setFormData({
      ...data,
      formData: { ...currentFormData, attachments },
    });
  };

  const handleUpload = (processedFiles: FileUploadType[]): void => {
    const attachedFile = data.formData.attachments || [];
    const nextAttachment = [...attachedFile, ...processedFiles];

    setAttachments(nextAttachment);
  };

  const handleRemoveUpload = (fileIndex: number): void => {
    const nextAttachment = data.formData.attachments.filter(
      (_file: FileUploadType, index: number) => index !== fileIndex
    );

    setAttachments(nextAttachment);
  };

  const uiSchema = data.formData.uiSchema || {};

  const widgets = {
    TextareaWidget: CustomTextareaWidget,
  };

  return (
    <div className={`w-full max-w-screen-sm mx-auto mt-6 ${className}`}>
      {isTransferableRecord && (
        <TransferableRecordForm
          beneficiaryAddress={ownership.beneficiaryAddress}
          holderAddress={ownership.holderAddress}
          setBeneficiaryAddress={(beneficiaryAddress) =>
            setOwnership({
              beneficiaryAddress,
              holderAddress: ownership.holderAddress,
            })
          }
          setHolderAddress={(holderAddress) =>
            setOwnership({
              beneficiaryAddress: ownership.beneficiaryAddress,
              holderAddress,
            })
          }
        />
      )}
      <div className="mb-10">
        <DataFileButton onDataFile={mergeFormValue} />
      </div>
      <JsonForm
        schema={schema}
        uiSchema={uiSchema}
        widgets={widgets}
        onChange={setFormData}
        formData={data?.formData}
        ObjectFieldTemplate={CustomObjectFieldTemplate}
        FieldTemplate={CustomFieldTemplate}
      />
      {attachmentAccepted && (
        <AttachmentDropzone
          acceptedFormat={attachmentAcceptedFormat}
          onUpload={handleUpload}
          onRemove={handleRemoveUpload}
          uploadedFiles={data?.formData?.attachments}
        />
      )}
    </div>
  );
};

export const DynamicForm = styled(DynamicFormRaw)`
  .form-group .form-group.field.field-object .dynamicForm-items {
    ${tw`
    my-4
  `}
  }

  legend {
    ${mixin.fontRobotoBold()}
    ${mixin.fontSize(20)}
  ${tw`
    text-grey-800 w-full mt-8 pt-6 capitalize border-t border-solid border-grey-300
  `}
  }

  .field-string,
  .field-integer,
  .field-number,
  .field-null {
    ${tw`
    flex flex-wrap items-center
  `}
  }
  .field-string .file-drop-zone {
    ${tw`flex flex-wrap w-full my-4`}
  }

  .checkbox label {
    ${tw`flex flex-wrap items-center w-full justify-center`}

    input {
      ${tw`mr-4`}
    }
  }

  .field-array {
    ${tw`
    mt-4
  `}
  }

  .array-item {
    ${tw`
    border-b border-grey-300 border-solid pb-2 mb-4
  `}
  }

  label {
    ${tw`
    w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-800
  `}
  }

  .field-string [type="text"],
  .field-number input,
  .field-integer input {
    ${tw`
    w-full sm:w-8/12 px-0 sm:px-2 h-10 rounded-none border border-solid border-grey-300
  `}
  }

  .btn {
    ${tw`
      transition-colors duration-200 ease-out cursor-pointer font-bold p-2 rounded shadow-md border border-transparent bg-orange text-white hover:bg-orange-600 m-2
    `}

    :first-of-type {
      ${tw`ml-0`}
    }

    :last-child {
      ${tw`mr-0`}
    }
  }

  .btn[type="submit"] {
    display: none;
  }

  i.glyphicon {
    ${tw`hidden`}
  }
  .btn-add::after {
    content: "Add";
  }
  .array-item-move-up::after {
    content: "Move Up";
  }
  .array-item-move-down::after {
    content: "Move Down";
  }
  .array-item-remove::after {
    content: "Remove";
  }

  .item-pd-0,
  .item-pd-0 > fieldset {
    ${tw`px-0`}
  }

  .help-block {
    ${tw`
    text-sm my-2 mx-0
  `}
  }
`;
