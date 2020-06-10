import React from "react";
import { fireEvent, render, screen, act, wait } from "@testing-library/react";
import { DataFileButton } from "./DataFileButton";

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

describe("dataFileButton", () => {
  it("should render correctly", () => {
    render(<DataFileButton onDataFile={() => {}} />);
    expect(screen.getByTestId("data-upload-button")).toHaveTextContent("Upload Data File");
  });

  it("should fire onDataFile when a file is successfully read", async () => {
    const onDataFile = jest.fn();
    render(<DataFileButton onDataFile={onDataFile} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File([JSON.stringify({ foo: "bar" })], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await wait(() => expect(onDataFile).toHaveBeenCalledWith({ foo: "bar" }));
    });
  });

  it("should show error when a file cannot be read", async () => {
    const onDataFile = jest.fn();
    render(<DataFileButton onDataFile={onDataFile} />);

    const dropzone = screen.getByTestId("data-upload-zone");
    const file = new File(["RANDOM_BINARY_FILE"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await wait(() => expect(screen.getByTestId("file-read-error")).not.toBeUndefined());
    });
  });
});
