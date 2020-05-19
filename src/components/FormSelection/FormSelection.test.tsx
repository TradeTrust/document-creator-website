/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import React from "react";
import { FormSelection } from "./FormSelection";

describe("formSelection", () => {
  it("should display the wallet address", () => {
    expect.assertions(1);
    render(<FormSelection config={{ wallet: { address: "0xabc...123" } } as any} />);
    expect(screen.getByTestId("wallet-info")).toHaveTextContent("0xabc...123");
  });
});
