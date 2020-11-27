import React, { FunctionComponent } from "react";
import { Config } from "../../../types/";
import { FormSelection } from "./FormSelection";

export default {
  title: "DynamicForm/FormSelection",
  component: FormSelection,
  parameters: {
    componentSubtitle: "FormSelection.",
  },
};

export const Default: FunctionComponent = () => (
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
        ],
      } as Config
    }
  />
);
