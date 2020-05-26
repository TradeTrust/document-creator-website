import React from "react";
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
const schema = {
  type: "object",
  required: ["blNumber"],
  properties: {
    blNumber: {
      type: "string",
      title: "BL Number",
    },
    shipper: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        address: {
          type: "object",
          properties: {
            street: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
        },
      },
    },
    consignee: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
    notifyParty: {
      title: "Notify Party",
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
    vessel: {
      type: "string",
    },
    voyageNo: {
      title: "Voyage No.",
      type: "string",
    },
    portOfLoading: {
      title: "Port of Loading",
      type: "string",
    },
    portOfDischarge: {
      title: "Port of Discharge",
      type: "string",
    },
    placeOfReceipt: {
      title: "Place of Receipt",
      type: "string",
    },
    placeOfDelivery: {
      title: "Place of Delivery",
      type: "string",
    },
    packages: {
      type: "array",
      title: "Packages",
      items: {
        type: "object",
        properties: {
          description: {
            type: "string",
          },
          measurement: {
            type: "string",
          },
          weight: {
            type: "string",
          },
        },
      },
    },
  },
};

const form = {
  name: "Bill of lading",
  type: "TRANSFERABLE_RECORD",
  defaults,
  schema,
};

export default {
  title: "DynamicForm|DynamicForm",
  component: DynamicForm,
  parameters: {
    info: { inline: true, header: false },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default = () => <DynamicForm form={form} />;