import styled from "@emotion/styled";
import { cloneDeep } from "lodash";
import React, { FunctionComponent } from "react";
import JsonForm from "react-jsonschema-form";
import tw from "twin.macro";
import { useFormsContext } from "../../../common/context/forms";
import { mixin } from "../../../styles";
import { FileUploadType, FormEntry, FormTemplate, FormType, Ownership, SetFormParams } from "../../../types";
import { DataFileButton } from "../DataFileButton";
import { TransferableRecordForm } from "../TransferableRecordForm";
import { AttachmentDropzone } from "./AttachmentDropzone";
import { CustomFieldTemplate, CustomObjectFieldTemplate, CustomTextareaWidget } from "./CustomTemplates";

export interface DynamicFormProps {
  schema: FormTemplate["schema"];
  attachmentAccepted: boolean;
  attachmentAcceptedFormat?: string;
  form: FormEntry;
  className?: string;
  type: FormType;
  setFormData: (formData: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  setOwnership: (ownership: Ownership) => void;
  setCurrentForm: (arg: SetFormParams) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  uiSchema?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  fileName?: string;
}

export const DynamicFormRaw: FunctionComponent<DynamicFormProps> = ({
  schema,
  uiSchema,
  form,
  setFormData,
  setOwnership,
  setCurrentForm,
  className,
  attachmentAccepted,
  type,
  fileName,
  attachmentAcceptedFormat = "",
}) => {
  const { templateIndex, data, ownership } = form;
  const { newPopulatedForm } = useFormsContext();
  const isTransferableRecord = type === "TRANSFERABLE_RECORD";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mergeFormValue = (value: any): void => {
    // If value is an array, call function from forms index to append
    // multiple docs of the current form's templateIndex
    if (Array.isArray(value)) {
      newPopulatedForm(templateIndex, value, fileName);
    } else {
      // But if it's just one object, we'll replace the values of the existing form (i.e. original behaviour)
      setCurrentForm({
        data: { ...data, formData: value?.data || data.formData },
        updatedOwnership: value?.ownership,
        fileName,
      });
    }
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

  const widgets = {
    TextareaWidget: CustomTextareaWidget,
  };

  return (
    <div className={`w-full mt-6 ${className}`}>
      <div className="mb-10">
        <DataFileButton onDataFile={mergeFormValue} schema={schema} />
      </div>
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
    text-gray-800 w-full mt-8 pt-6 capitalize border-t border-solid border-gray-300
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
    border-b border-gray-300 border-solid pb-2 mb-4
  `}
  }

  label {
    ${tw`
    w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-gray-800
  `}
  }

  .field-string [type="text"],
  .field-number input,
  .field-integer input {
    ${tw`
    w-full sm:w-8/12 px-0 sm:px-2 h-10 rounded-none border border-solid border-gray-300
  `}
  }

  .btn {
    ${tw`
      transition-colors duration-200 ease-out cursor-pointer font-bold p-2 rounded border border-gray-300 bg-white text-blue-500 m-2
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
    content: "Add Item";
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
