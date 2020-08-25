import { render, screen } from "@testing-library/react";
import React from "react";
import { PublishingScreen } from "./PublishingScreen";

const forms = [
  {
    fileName: "abc",
    data: {
      schema: {},
      uiSchema: {},
      idSchema: {},
      formData: {},
      edit: true,
      errors: {},
      errorSchema: {},
    },
    templateIndex: 1,
    ownership: {
      beneficiaryAddress: "",
      holderAddress: "",
    },
  },
  {
    fileName: "abcd",
    data: {
      schema: {},
      uiSchema: {},
      idSchema: {},
      formData: {},
      edit: true,
      errors: {},
      errorSchema: {},
    },
    templateIndex: 1,
    ownership: {
      beneficiaryAddress: "",
      holderAddress: "",
    },
  },
];

describe("publishing", () => {
  it("should load the UI and the number of forms correctly", () => {
    render(<PublishingScreen forms={forms} />);

    expect(
      screen.queryAllByText("Please wait while we are publishing the document(s).")
    ).toHaveLength(1);
    expect(screen.queryAllByText(/Publishing/)).toHaveLength(1);
    expect(screen.queryAllByText(/2/)).toHaveLength(1);
    expect(screen.queryAllByText(/document/)).toHaveLength(2);
  });
});
