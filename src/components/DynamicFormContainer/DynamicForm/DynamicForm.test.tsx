import { render, screen } from "@testing-library/react";
import React from "react";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { Form } from "../../../types";
import { DynamicForm } from "./DynamicForm";

const form = sampleConfig.forms[0] as Form;

const mockSetFormData = jest.fn();

describe("dynamicForm", () => {
  beforeEach(() => {
    mockSetFormData.mockReset();
  });

  it("should render the fields from the form definition", async () => {
    render(
      <DynamicForm
        schema={form.schema}
        formData={{}}
        setFormData={mockSetFormData}
        attachmentAccepted={false}
      />
    );
    expect(screen.getByLabelText("Information")).not.toBeUndefined();
  });
});
