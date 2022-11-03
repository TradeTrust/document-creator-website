import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FilesInfo } from "./FilesInfo";

describe("filesInfo", () => {
  it("should render a uploaded pdf file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            fileName: "asdfdfs.pdf",
            data: "asdfasdf",
            mimeType: "application/pdf",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.pdf")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render file icons correctly", () => {
    render(
      <>
        <FilesInfo
          filesInfo={[
            {
              fileName: "asdfdfs.pdf",
              data: "asdfasdf",
              mimeType: "application/pdf",
            },
            {
              fileName: "asdfdfs.txt",
              data: "asdfasdf",
              mimeType: "text/plain",
            },
            {
              fileName: "asdfdfs.png",
              data: "asdfasdf",
              mimeType: "image/png",
            },
            {
              fileName: "asdfdfs.csv",
              data: "asdfasdf",
              mimeType: "text/csv",
            },
            {
              fileName: "asdfdfs.xls",
              data: "asdfasdf",
              mimeType: "application/vnd.ms-excel",
            },
            {
              fileName: "asdfdfs.xlsx",
              data: "asdfasdf",
              mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            },
            {
              fileName: "asdfdfs.docx",
              data: "asdfasdf",
              mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            },
            {
              fileName: "asdfdfs.doc",
              data: "asdfasdf",
              mimeType: "application/msword",
            },
            {
              fileName: "asdfdfs.jpeg",
              data: "asdfasdf",
              mimeType: "image/jpeg",
            },
            {
              fileName: "asdfdfs.json",
              data: "asdfasdf",
              mimeType: "application/json",
            },
          ]}
          removeFile={() => {}}
        />
      </>
    );
    expect(screen.queryByTestId("attachment-icon-pdf")).not.toBeNull();
    expect(screen.getAllByTestId("attachment-icon-csv")).toHaveLength(3);
    expect(screen.queryByTestId("attachment-icon-png")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-txt")).not.toBeNull();
    expect(screen.getAllByTestId("attachment-icon-doc")).toHaveLength(2);
    expect(screen.queryByTestId("attachment-icon-jpg")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-paperclip")).not.toBeNull();
  });

  it("should remove the file when 'X' is clicked", async () => {
    const mockRemoveFileFn = jest.fn();

    render(
      <FilesInfo
        filesInfo={[
          {
            fileName: "asdfdfs.pdf",
            data: "asdfasdf",
            mimeType: "application/pdf",
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
