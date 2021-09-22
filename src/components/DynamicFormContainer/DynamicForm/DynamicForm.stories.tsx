import { FunctionComponent } from "react";
import sample from "../../../test/fixtures/sample-config-ropsten.json";
import { FormTemplate } from "../../../types";
import { DynamicForm } from "./DynamicForm";

export default {
  title: "DynamicForm/DynamicForm",
  component: DynamicForm,
  parameters: {
    componentSubtitle: "DynamicForm.",
  },
};

const mockFormData = {
  fileName: "document-1",
  data: { formData: {} },
  templateIndex: 0,
  ownership: { holderAddress: "", beneficiaryAddress: "" },
  extension: "tt",
};

export const Ebl: FunctionComponent = () => {
  const sampleForm = sample.forms[1];
  const formEbl: FormTemplate = {
    name: sampleForm.name,
    type: sampleForm.type as any,
    defaults: sampleForm.defaults, // Default values = we do not want the admin staff to change
    schema: sampleForm.schema, // Config values = the admin staff will be changing
    attachments: sampleForm.attachments, // Config values = the admin staff will be changing
    uiSchema: sampleForm.uiSchema, // Config values = the admin staff will be changing
    extension: sampleForm.extension, // Config values = the admin staff will be changing
  };

  return (
    <DynamicForm
      schema={formEbl.schema}
      uiSchema={formEbl.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};

export const Invoice: FunctionComponent = () => {
  const sampleForm = sample.forms[4];
  const formInvoice: FormTemplate = {
    name: sampleForm.name,
    type: sampleForm.type as any,
    defaults: sampleForm.defaults,
    schema: sampleForm.schema,
    attachments: sampleForm.attachments,
    uiSchema: sampleForm.uiSchema,
    extension: sampleForm.extension,
  };

  return (
    <DynamicForm
      schema={formInvoice.schema}
      uiSchema={formInvoice.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};

export const Coo: FunctionComponent = () => {
  const sampleForm = sample.forms[0];
  const formCoo: FormTemplate = {
    name: sampleForm.name,
    type: sampleForm.type as any,
    defaults: sampleForm.defaults,
    schema: sampleForm.schema,
    attachments: sampleForm.attachments,
    uiSchema: sampleForm.uiSchema,
    extension: sampleForm.extension,
  };

  return (
    <DynamicForm
      schema={formCoo.schema}
      uiSchema={formCoo.uiSchema}
      form={mockFormData}
      setFormData={() => {}}
      setOwnership={() => {}}
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type={sampleForm.type as any}
    />
  );
};
