import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { CustomFileWidget, FilesInfo } from "./CustomFileWidget";

describe("customFileWidget", () => {
  it("should render with the props", () => {
    render(
      <CustomFileWidget
        onChange={() => {}}
        value={[]}
        multiple={true}
        options={{ accept: ".pdf" }}
        disabled={false}
      />
    );

    expect(screen.getByText("Drag and drop file here")).not.toBeNull();
    expect(screen.getByText("or")).not.toBeNull();
    expect(screen.getByText("Browse File")).not.toBeNull();
    expect(screen.queryByTestId(/upload-file-/)).toBeNull();
  });
});

describe("filesInfo", () => {
  it("should render a uploaded file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            name: "asdfdfs.pdf",
            size: 123123,
            dataURL: "asdfasdf",
            type: "application/pdf",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-0")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.pdf")).not.toBeNull();
    expect(screen.queryByText("(123KB)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should remove the file when 'X' is clicked", async () => {
    const mockRemoveFileFn = jest.fn();

    render(
      <FilesInfo
        filesInfo={[
          {
            name: "asdfdfs.pdf",
            size: 123123,
            dataURL: "asdfasdf",
            type: "application/pdf",
          },
        ]}
        removeFile={mockRemoveFileFn}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-uploaded-file-0"));
    });

    expect(mockRemoveFileFn).toHaveBeenCalledTimes(1);
  });
});
