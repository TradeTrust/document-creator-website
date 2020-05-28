import styled from "@emotion/styled";
import { merge } from "lodash";
import React, { useState } from "react";
import JsonForm, { IChangeEvent } from "react-jsonschema-form";
import { mixin, vars } from "../../styles";
import { Wrapper } from "../../UI/Wrapper";
import { DataFileDropZone } from "./DataFileDropZone";
import tw from "twin.macro";

// Bootstrap is messing around with the config with tailwind
// Ideally we want to remove bootstrap, but first we have to extract the styles
// for the forms first
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./index.css";

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

  // interface FieldProps {
  //   id: string;
  //   classNames: string;
  //   label: string;
  //   help: string;
  //   required: boolean;
  //   description: string;
  //   errors: string;
  //   children: string;
  //   fields: string;
  // }
  // function CustomFieldTemplate(props: FieldProps) {
  //   const { id, classNames, label, help, required, description, errors, children, fields } = props;
  //   console.log("field", fields);
  //   return (
  //     <div className={classNames}>
  //       <label htmlFor={id}>
  //         {label}
  //         {required ? "*" : null}
  //       </label>
  //       <div className="border border-red border-solid">{children}</div>
  //       {description}
  //       {errors}
  //       {help}
  //     </div>
  //   );
  // }
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
        {title &&
          <TitleField title={title} />
        }
        <ul>
          {properties.map((prop: any) => (
            <li className="mb-4" key={prop.content.key}>{prop.content}</li>
          ))}
        </ul>
        {description}
      </>
    )
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
        // uiSchema={uiSchema}
        // FieldTemplate={CustomFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
      />
    </Wrapper>
  );
})`
  legend {
    ${mixin.fontRobotoBold()}
    ${mixin.fontSize(20)}
    color: ${vars.greyDark};
    border-bottom: solid 1px ${vars.greyLighter};
    width: 100%;
    padding-bottom: 10px;
    margin-bottom: 15px;

    ~ ul {
      margin-bottom: 80px;
    }
  }

  .field-string {
    ${tw`
      flex flex-wrap items-center
    `}
  }

  label {
    ${tw`
      w-full sm:w-1/3 px-0 sm:px-2 sm:text-right
    `}
  }

  input {
    ${tw`
      w-full sm:w-2/3 px-0 sm:px-2
    `}

    min-height: 40px;
    border-radius: 0;
    border: 1px solid ${vars.greyLighter};
  }

  button {
    border: 1px solid ${vars.orange};
    background: ${vars.orange};
    border-radius: ${vars.buttonRadius};
    padding: 0.5rem 1rem;
    color: ${vars.white};
    margin: auto 0.5rem;
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
    display: inline-block;
    vertical-align: middle;

    &:not(:disabled):not(.disabled):active,
    &:focus,
    &.focus,
    &:hover,
    &:active,
    &.active {
      box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
    }

    :first-of-type {
      margin-left: 0;
    }

    :last-child {
      margin-right: 0;
    }
  }

  i.glyphicon {
    display: none;
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

  .array-item {
    margin-bottom: 10px;
    margin-right: 30px;
  }

  .array-item-remove {
    flex: 0.8 !important;
  }

  .item-pd-0,
  .item-pd-0 > fieldset {
    padding-right: 0;
    padding-left: 0;
  }

  .array-item-add {
    margin-left: 85px;
  }

  .array-item-list {
    margin: 0 !important;
  }

  .help-block {
    font-size: 13px;
    margin: 8px 0;
  }
`;
