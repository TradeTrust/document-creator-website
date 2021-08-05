/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import React from "react";
import { FormSelection } from "./FormSelection";
import { BrowserRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "/form",
  }),
}));
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

    render(
      <BrowserRouter>
        <FormSelection config={configFile as any} />
      </BrowserRouter>
    );

    const buttons = screen.getAllByRole("button");

    expect(buttons).toHaveLength(2);

    const textBL = screen.getByText("Bill of Lading").textContent;
    expect(textBL).toStrictEqual("Bill of Lading");

    const textPO = screen.getByText("Purchase Order").textContent;
    expect(textPO).toStrictEqual("Purchase Order");
  });
});
