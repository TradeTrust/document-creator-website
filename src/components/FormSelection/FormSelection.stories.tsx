import React from "react";
import { FormSelection } from "./FormSelection";

export default {
  title: "FormSelection|FormSelection",
  component: FormSelection,
  parameters: {
    info: { inline: true, header: false },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Default = () => <FormSelection config={{ wallet: { address: "0x1234...5678" } } as any} />;
