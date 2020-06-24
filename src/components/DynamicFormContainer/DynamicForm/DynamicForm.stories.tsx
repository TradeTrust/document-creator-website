import React from "react";
import sample from "../../../test/fixtures/sample-config.json";
import { ConfigFile, Form } from "../../../types";
import { DynamicForm } from "./DynamicForm";

// Default values in the document we do not want the admin staff to change
const defaults = {
  $template: {
    type: "EMBEDDED_RENDERER",
    name: "BILL_OF_LADING",
    url: "https://demo-cnm.openattestation.com",
  },
  issuers: [
    {
      identityProof: {
        type: "DNS-TXT",
        location: "demo-tradetrust.openattestation.com",
      },
      name: "DEMO STORE",
      tokenRegistry: "0xc3E9eBc6aDA9BA4B4Ce65D71901Cb2307e9670cE",
    },
  ],
  name: "Maersk Bill of Lading",
};

// Form values that the admin staff will be changing
const configFile = sample as ConfigFile;
const schema = configFile.forms[0].schema;
const attachments = configFile.forms[0].attachments;

const form: Form = {
  name: "Bill of lading",
  type: "TRANSFERABLE_RECORD",
  defaults,
  schema,
  attachments,
};

export default {
  title: "DynamicForm|DynamicForm",
  component: DynamicForm,
  parameters: {
    info: { inline: true, header: false },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default = () => <DynamicForm form={form} handleSubmit={console.log} />;
