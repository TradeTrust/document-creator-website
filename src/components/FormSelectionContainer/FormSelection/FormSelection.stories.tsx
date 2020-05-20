import React from "react";
import { FormSelection } from "./FormSelection";

export default {
  title: "FormSelection|FormSelection",
  component: FormSelection,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <FormSelection
    config={
      {
        wallet: { address: "0x1234...5678" },
        forms: [
          {
            name: "Bill of Lading",
            type: "TRANSFERABLE_RECORD",
          },
          {
            name: "Purchase Order",
            type: "VERIFIABLE_DOCUMENT",
          },
          {
            name: "Invoice",
            type: "INVOICE",
          },
        ],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
    }
  />
);
