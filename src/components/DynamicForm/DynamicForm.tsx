import React, { useState } from "react";
import JsonForm, { IChangeEvent } from "react-jsonschema-form";
import { merge } from "lodash";
import { DataFileDropZone } from "./DataFileDropZone";

// Bootstrap is messing around with the config with tailwind
// Ideally we want to remove bootstrap, but first we have to extract the styles
// for the forms first
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

export interface Form {
  name: string;
  type: string;
  defaults: any;
  schema: any;
}

export const DynamicForm = ({ form }: { form: Form }) => {
  const [formData, setFormData] = useState<IChangeEvent>();

  const setFormValue = (value: any) => {
    if (!formData) return;
    setFormData({ ...formData, formData: merge(formData.formData, value) });
  };
  const onSubmit = () => {
    const rawDocument = merge(form.defaults, formData?.formData);
    console.log(rawDocument);
  };
  return (
    <>
      <DataFileDropZone onDataFile={setFormValue} />
      <JsonForm onSubmit={onSubmit} schema={form.schema} onChange={setFormData} formData={formData?.formData} />
    </>
  );
};
