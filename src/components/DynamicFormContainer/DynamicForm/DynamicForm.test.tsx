import React from "react";
import { render, screen, fireEvent, act, waitForDomChange } from "@testing-library/react";
import { DynamicForm } from "./DynamicForm";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { Form } from "../../../types";

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

describe("dynamicForm", () => {
  it("should render the fields from the form definition", async () => {
    render(<DynamicForm form={form} handleSubmit={() => {}} />);
    expect(screen.getByLabelText("BL Number*")).not.toBeUndefined();
    expect(screen.getByLabelText("Port of Discharge")).not.toBeUndefined();
  });

  it("should merge the data with defaults and file drop and fire handleSubmit when form is submitted", async () => {
    const handleSubmit = jest.fn();
    render(<DynamicForm form={form} handleSubmit={handleSubmit} />);

    // Drop data file in drop zone
    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File(
      [
        JSON.stringify({
          placeOfDelivery: "POD_FROM_FILE",
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
      fireEvent(dropzone, event);
      await waitForDomChange();
    });

    // Type stuffs into the field
    await act(async () => {
      const blNoInput = screen.getByRole("textbox", { name: /BL Number/, exact: false });
      fireEvent.change(blNoInput, { target: { value: "MY_BL_NUMBER" } });
    });

    await act(async () => {
      const submitButton = screen.getByText("Submit");
      fireEvent.click(submitButton);
    });
    const callArg = handleSubmit.mock.calls[0][0];

    // Check that default values are there
    expect(callArg.name).toBe("Maersk Bill of Lading");
    // Check that user entered values are there
    expect(callArg.blNumber).toBe("MY_BL_NUMBER");
    // Check that form data values are there
    expect(callArg.placeOfDelivery).toBe("POD_FROM_FILE");
  });
});
