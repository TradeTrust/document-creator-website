/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { FormSelection, ButtonWrapper } from "./FormSelection";

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
      ],
    };

    render(<FormSelection config={configFile as any} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);

    const textBL = screen.getByText("Bill of Lading").textContent;
    expect(textBL).toStrictEqual("Bill of Lading");

    const textPO = screen.getByText("Purchase Order").textContent;
    expect(textPO).toStrictEqual("Purchase Order");
  });
});

describe("buttomWrapper", () => {
  it("should display forms accordingly when control + index is pressed", () => {
    const mockOnFormSelection = jest.fn();
    const mockForm = {
      name: "Bill of Lading",
      type: "TRANSFERABLE_RECORD",
    };
    const mockIndex = 0;
    render(
      <ButtonWrapper handleClick={mockOnFormSelection} form={mockForm as any} index={mockIndex} />
    );

    const formHeaderDom = screen.getByTestId("form-selection-button");
    fireEvent.keyDown(formHeaderDom, { key: "Control" });
    fireEvent.keyDown(formHeaderDom, { key: "Meta" });
    fireEvent.keyDown(formHeaderDom, { key: (mockIndex + 1).toString() });
    expect(mockOnFormSelection).toHaveBeenCalledWith(mockIndex);
  });
});
