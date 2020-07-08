import { render, screen } from "@testing-library/react";
import React from "react";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { Form } from "../../../types";
import { DynamicForm } from "./DynamicForm";

const form = sampleConfig.forms[0] as Form;

const mockSetFormData = jest.fn();
const mockSetOwnership = jest.fn();

describe("dynamicForm", () => {
  beforeEach(() => {
    mockSetFormData.mockReset();
  });

  it("should render the fields from the form definition", async () => {
    render(
      <DynamicForm
        type="TRANSFERABLE_RECORD"
        schema={form.schema}
        form={{
          fileName: "",
          data: { formData: {} },
          templateIndex: 0,
          ownership: { beneficiaryAddress: "", holderAddress: "" },
        }}
        setFormData={mockSetFormData}
        setOwnership={mockSetOwnership}
        attachmentAccepted={false}
      />
    );
    expect(screen.getByLabelText("Information")).not.toBeUndefined();
  });

  it.todo("should show the ownership section when type is transferable record");
  it.todo("should not show the ownership section when type is verifiable document");
  it.todo("should render the attachment dropzone section if attachment is accepted");
  it.todo("should not render the attachment dropzone section if attachment is not accepted");
  it.todo("should render the data file dropzone");
});
