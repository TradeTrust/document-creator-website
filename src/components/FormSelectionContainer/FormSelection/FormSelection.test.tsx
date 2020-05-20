/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import React from "react";
import { FormSelection } from "./FormSelection";

describe("formSelection", () => {
  it("should display the buttons according to the forms stored in the config file", () => {
    const configFile = {
      wallet: {
        address: "0xabc...123",
      },
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
    };

    render(<FormSelection config={configFile} as ConfigFile />);

    expect(screen.getByTestId("TRANSFERABLE_RECORD-button")).not.toBeNull();
    expect(screen.getByTestId("VERIFIABLE_DOCUMENT-button")).not.toBeNull();
    expect(screen.getByTestId("INVOICE-button")).not.toBeNull();
  });
});
