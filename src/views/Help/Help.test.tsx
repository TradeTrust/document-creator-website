import { render, screen } from "@testing-library/react";
import React from "react";
import { Help } from "./Help";

describe("Help", () => {
  it("render help text", () => {
    expect.assertions(1);
    render(<Help />);
    expect(screen.getByRole("heading")).toHaveTextContent("Help");
  });
});
