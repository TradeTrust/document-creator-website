import React from "react";
import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";
import { DataFileButton } from "./DataFileButton";

const onDataFile = jest.fn();
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
const mockSchema = {
  properties: { abc: { title: "Abc", type: "string" } },
  required: ["abc"],
  type: "object",
};

describe("dataFileButton", () => {
  it("should render correctly", () => {
    render(<DataFileButton onDataFile={() => {}} schema={{}} />);
    expect(screen.getByTestId("data-upload-button")).toHaveTextContent("Upload Data File");
  });

  it("should fire onDataFile when a file is successfully read", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={{}} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File([JSON.stringify({ foo: "bar" })], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(onDataFile).toHaveBeenCalledWith({ foo: "bar" }));
    });
  });

  it("should show error when a file cannot be read", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={{}} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File(["RANDOM_BINARY_FILE"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("file-read-error")).not.toBeUndefined());
    });
  });

  it("should validate against schema", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const mockDataFileUpload = { data: { abc: "bar" } };
    const file = new File([JSON.stringify(mockDataFileUpload)], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(onDataFile).toHaveBeenCalledWith(mockDataFileUpload));
    });
  });

  it("should not validate against schema", async () => {
    render(<DataFileButton onDataFile={onDataFile} schema={mockSchema} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const mockDataFileUpload = { data: { foo: "bar" } };
    const file = new File([JSON.stringify(mockDataFileUpload)], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await waitFor(() => expect(screen.getByTestId("file-read-error")).not.toBeUndefined());
    });
  });
});
