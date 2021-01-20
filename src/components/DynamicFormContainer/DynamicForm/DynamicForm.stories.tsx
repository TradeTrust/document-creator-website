import React, { useState, FunctionComponent } from "react";
import sample from "../../../test/fixtures/sample-config-ropsten.json";
import { ConfigFile, FormTemplate } from "../../../types";
import { DynamicForm } from "./DynamicForm";

// Default values in the document we do not want the admin staff to change
const defaults = {
  $template: {
    type: "EMBEDDED_RENDERER",
    name: "COVERING_LETTER",
    url: "https://generic-templates.tradetrust.io",
  },
  issuers: [
    {
      name: "Demo Issuer",
      documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
      identityProof: {
        type: "DNS-TXT",
        location: "demo-tradetrust.openattestation.com",
      },
    },
  ],
  name: "Covering Letter",
  logo: "https://www.aretese.com/images/govtech-animated-logo.gif",
  title: "Documents Bundle",
  remarks: "Some very important documents in here for some submission",
  uiSchema: {
    remarks: {
      "ui:widget": "textarea",
    },
  },
};

// Form values that the admin staff will be changing
const configFile = sample as ConfigFile;
const schema = configFile.forms[2].schema;
const attachments = configFile.forms[2].attachments;

const form: FormTemplate = {
  name: "Covering Letter",
  type: "VERIFIABLE_DOCUMENT",
  defaults,
  schema,
  attachments,
};

export default {
  title: "DynamicForm/DynamicForm",
  component: DynamicForm,
  parameters: {
    componentSubtitle: "DynamicForm.",
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default: FunctionComponent = () => {
  const [formData, setFormData] = useState<any>({
    fileName: "document-1",
    data: { formData: {} },
    templateIndex: 0,
    ownership: { holderAddress: "", beneficiaryAddress: "" },
  });

  return (
    <DynamicForm
      schema={form.schema}
      form={formData}
      setFormData={setFormData}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setOwnership={() => {}}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setCurrentForm={() => {}}
      attachmentAccepted={true}
      type="VERIFIABLE_DOCUMENT"
    />
  );
};
