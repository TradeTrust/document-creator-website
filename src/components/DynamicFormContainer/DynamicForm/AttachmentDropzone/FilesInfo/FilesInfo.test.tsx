import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { FilesInfo } from "./FilesInfo";

describe("filesInfo", () => {
  it("should render a uploaded pdf file correctly", () => {
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
    expect(screen.queryByTestId("attachment-icon-application/pdf")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.pdf")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded txt file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.txt",
            data: "asdfasdf",
            type: "text/plain",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-text/plain")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.txt")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded png file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.png",
            data: "asdfasdf",
            type: "image/png",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-image/png")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.png")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded csv file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.csv",
            data: "asdfasdf",
            type: "text/csv",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-text/csv")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.csv")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded docx file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.docx",
            data: "asdfasdf",
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(
      screen.queryByTestId(
        "attachment-icon-application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    ).not.toBeNull();
    expect(screen.queryByText("asdfdfs.docx")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded doc file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.doc",
            data: "asdfasdf",
            type: "application/msword",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-application/msword")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.doc")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });

  it("should render a uploaded jpg file correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.jpeg",
            data: "asdfasdf",
            type: "image/jpeg",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-image/jpeg")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.jpeg")).not.toBeNull();
    expect(screen.queryByText("(6 B)")).not.toBeNull();
    expect(screen.queryByTestId("remove-uploaded-file-0")).not.toBeNull();
  });
  it("should render an unknown file type correctly", () => {
    render(
      <FilesInfo
        filesInfo={[
          {
            filename: "asdfdfs.json",
            data: "asdfasdf",
            type: "application/json",
          },
        ]}
        removeFile={() => {}}
      />
    );
    expect(screen.queryByTestId("upload-file-0")).not.toBeNull();
    expect(screen.queryByTestId("attachment-icon-paperclip")).not.toBeNull();
    expect(screen.queryByText("asdfdfs.json")).not.toBeNull();
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
