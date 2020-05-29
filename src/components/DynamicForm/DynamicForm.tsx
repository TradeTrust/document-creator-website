import styled from "@emotion/styled";
import { merge } from "lodash";
import React, { useState } from "react";
import JsonForm, { IChangeEvent } from "react-jsonschema-form";
import tw from "twin.macro";
import { mixin } from "../../styles";
import { Wrapper } from "../../UI/Wrapper";
import { DataFileDropZone } from "./DataFileDropZone";

export interface Form {
  name: string;
  type: string;
  defaults: any;
  schema: any;
}

export const DynamicForm = styled(({ form, className }: { form: Form; className?: string }) => {
  const [formData, setFormData] = useState<IChangeEvent>();

  const setFormValue = (value: any) => {
    if (!formData) return;
    setFormData({ ...formData, formData: merge(formData.formData, value) });
  };
  const onSubmit = () => {
    const rawDocument = merge(form.defaults, formData?.formData);
    console.log(rawDocument);
  };

  interface CustomObjectTemplate {
    TitleField: any;
    properties: any;
    title: string;
    description: string;
  }
  function ObjectFieldTemplate({
    TitleField,
    properties,
    title,
    description,
  }: CustomObjectTemplate) {
    return (
      <>
        {title && <TitleField title={title} />}
        <ul>
          {properties.map((prop: any) => (
            <li className="mb-4" key={prop.content.key}>
              {prop.content}
            </li>
          ))}
        </ul>
        {description}
      </>
    );
  }

  return (
    <Wrapper className={className}>
      <div className="mb-10">
        <DataFileDropZone onDataFile={setFormValue} />
      </div>
      <JsonForm
        onSubmit={onSubmit}
        schema={form.schema}
        onChange={setFormData}
        formData={formData?.formData}
        ObjectFieldTemplate={ObjectFieldTemplate}
      />
    </Wrapper>
  );
})`
  legend {
    ${mixin.fontRobotoBold()}
    ${mixin.fontSize(20)}
    ${tw`
      mt-16 border-b border-grey-lighter border-solid text-grey-dark w-full mb-4
    `}
  }

  .field-string {
    ${tw`
      flex flex-wrap items-center pr-8
    `}
  }
  .field-array {
    ${tw`
      mt-4
    `}
  }

  .array-item {
    ${tw`
      border-b border-grey-lighter border-solid pb-2 mb-4
    `}
  }

  label {
    ${tw`
      w-full sm:w-1/3 px-0 sm:px-4 sm:text-right text-grey-dark
    `}
  }

  input {
    ${tw`
      w-full sm:w-2/3 px-0 sm:px-2 h-10 rounded-none border border-solid border-grey-lighter
    `}
  }

  button {
    ${tw`
      border border-solid border-orange bg-orange rounded py-2 px-4 text-white m-2 shadow-md inline-block align-middle
    `}

    &:not(:disabled):not(.disabled):active,
    &:focus,
    &.focus,
    &:hover,
    &:active,
    &.active {
      box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
    }

    :first-of-type {
      ${tw`ml-0`}
    }

    :last-child {
      ${tw`mr-0`}
    }
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
