import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { Form } from "../../../types";
import { DynamicForm } from "./DynamicForm";

const form = sampleConfig.forms[0] as Form;

const mockData = (files: File[]): any => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: any) => ({
        kind: "file",
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
};

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
        setAttachmentValue={() => {}}
      />
    );
    expect(screen.getByLabelText("Information")).not.toBeUndefined();
  });

  it("should merge the data with defaults and file drop and fire handleSubmit when form is submitted", async () => {
    render(
      <DynamicForm
        schema={form.schema}
        formData={{
          formData: { foo: "bar" },
        }}
        setFormData={mockSetFormData}
        attachmentAccepted={false}
        setAttachmentValue={() => {}}
      />
    );

    // Drop data file in drop zone
    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File(
      [
        JSON.stringify({
          cow: "moo",
        }),
      ],
      "sample.json",
      {
        type: "application/json",
      }
    );
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      await fireEvent(dropzone, event);
    });
    await waitFor(() =>
      expect(mockSetFormData).toHaveBeenCalledWith({
        formData: {
          foo: "bar",
          cow: "moo",
        },
      })
    );
  });
});
