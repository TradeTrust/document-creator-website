import React from "react";
import { render, screen } from "@testing-library/react";
import { FormErrorBanner } from "./FormErrorBanner";

const errors = [
  {
    keyword: "required",
    dataPath: "",
    schemaPath: "#/required",
    params: { missingProperty: "blNumber" },
    message: "should have required property 'blNumber'",
  },
];

describe("formErrorBanner", () => {
  it("should show errors when there are any", () => {
    render(<FormErrorBanner formError={errors} />);
    expect(screen.getByTestId("form-error-banner")).toHaveTextContent(
      "should have required property 'blNumber'"
    );
  });

  it("should not display when there are no errors", () => {
    render(<FormErrorBanner formError={undefined} />);
    expect(screen.queryByTestId("form-error-banner")).toBeNull();
  });
});
