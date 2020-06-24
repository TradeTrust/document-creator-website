import { act, fireEvent, render, screen, wait } from "@testing-library/react";
import React from "react";
import { AttachmentDropzone } from "./AttachmentDropzone";

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

describe("attachmentDropzone", () => {
  let atobSpy: jest.SpyInstance;
  /* eslint-disable jest/no-hooks */
  beforeEach(() => {
    atobSpy = jest.spyOn(global, "atob");
  });

  afterEach(() => {
    atobSpy.mockRestore();
  });

  it("should render with the props", () => {
    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={() => {}}
        onRemove={() => {}}
        uploadedFiles={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdf",
            type: "application/pdf",
          },
        ]}
      />
    );

    expect(screen.getByText("Drag and drop file here")).not.toBeNull();
    expect(screen.getByText("or")).not.toBeNull();
    expect(screen.getByText("Browse File")).not.toBeNull();
  });
  it("should fire onUpload when a file is successfully read", async () => {
    const mockOnUploadFn = jest.fn();
    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={mockOnUploadFn}
        onRemove={() => {}}
        uploadedFiles={[]}
      />
    );

    const dropzone = screen.getByTestId("attachment-upload-zone");
    const file = new File([JSON.stringify({ foo: "bar" })], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await wait(() => expect(mockOnUploadFn).toHaveBeenCalledTimes(1));
    });
  });

  it("should show error when a file cannot be read", async () => {
    render(
      <AttachmentDropzone
        acceptedFormat=".pdf"
        onUpload={() => {}}
        onRemove={() => {}}
        uploadedFiles={[]}
      />
    );

    const dropzone = screen.getByTestId("attachment-upload-zone");
    const file = new File(["RANDOM_BINARY_FILE"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await wait(() => expect(screen.getByTestId("invalid-file-error")).not.toBeUndefined());
    });
  });

  it("should show error when the total file size is over 20MB", async () => {
    atobSpy.mockImplementation(() => ({ length: 123000000 }));

    render(
      <AttachmentDropzone
        acceptedFormat=".pdf, .json"
        onUpload={() => {}}
        onRemove={() => {}}
        uploadedFiles={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdfasdf",
            type: "application/pdf",
          },
        ]}
      />
    );

    const dropzone = screen.getByTestId("attachment-upload-zone");
    const file = new File(["sample"], "sample.json", {
      type: "application/json",
    });
    const data = mockData([file]);
    const event = new Event("drop", { bubbles: true });
    Object.assign(event, data);

    await act(async () => {
      fireEvent(dropzone, event);
      await wait(() => expect(screen.getByTestId("file-size-error")).not.toBeUndefined());
    });
  });
});
