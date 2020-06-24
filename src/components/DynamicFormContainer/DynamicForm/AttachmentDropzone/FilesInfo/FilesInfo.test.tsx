import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FilesInfo } from "./FilesInfo";

describe("filesInfo", () => {
  it("should render a uploaded file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdf",
            type: "application/pdf",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-0")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.pdf")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should remove the file when 'X' is clicked", async () => {
    const mockRemoveFileFn = jest.fn();

    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.pdf",
            data: "asdfasdf",
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
