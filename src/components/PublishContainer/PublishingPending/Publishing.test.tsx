import { render, screen } from "@testing-library/react";
import React from "react";
import { PublishingPending } from "./Publishing";

const forms = [
  {
    fileName: "abc.tt",
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
  },
  {
    fileName: "abcd.tt",
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
  },
];

describe("publishing", () => {
  it("should load the UI and the number of forms correctly", () => {
    render(<Publishing forms={forms} />);

    expect(
      screen.queryAllByText("Please wait while we are publishing the document(s).")
    ).toHaveLength(1);
    expect(screen.queryAllByText(/Publishing/)).toHaveLength(1);
    expect(screen.queryAllByText(/2/)).toHaveLength(1);
    expect(screen.queryAllByText(/document/)).toHaveLength(2);
  });
});
