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
  properties: {
    blNumber: {
      title: "Bill of Lading",
      type: "object",
      required: ["name"],
      properties: {
        name: {
          title: "BL Number",
          type: "string",
        },
      },
    },
    shipper: {
      title: "Shipper",
      type: "object",
      properties: {
        name: {
          title: "Shipper",
          type: "string",
        },
      },
    },
    address: {
      title: "Address",
      type: "object",
      properties: {
        street: {
          title: "Street",
          type: "string",
        },
        country: {
          title: "Country",
          type: "string",
        },
      },
    },
    consignee: {
      title: "Consignee",
      type: "object",
      properties: {
        name: {
          title: "Name",
          type: "string",
        },
        type: {
          title: "Type",
          type: "string",
        },
      },
    },
    notifyParty: {
      title: "Notify Party",
      type: "object",
      properties: {
        name: {
          title: "Name",
          type: "string",
        },
        vessel: {
          title: "Vessel",
          type: "string",
        },
        voyageNo: {
          title: "Voyage No.",
          type: "string",
          format: "data-url",
        },
        portOfLoading: {
          title: "Port of Loading",
          type: "null",
        },
        portOfDischarge: {
          title: "Port of Discharge",
          type: "integer",
        },
        placeOfReceipt: {
          title: "Place of Receipt",
          type: "number",
        },
        placeOfDelivery: {
          title: "Place of Delivery",
          type: "boolean",
        },
      },
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
