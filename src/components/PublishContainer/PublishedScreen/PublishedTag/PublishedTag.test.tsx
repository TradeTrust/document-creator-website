import { fireEvent, render, screen } from "@testing-library/react";
import { saveAs } from "file-saver";
import React from "react";
import { WrappedDocument } from "../../../../types";
import { PublishedTag } from "./PublishedTag";

jest.mock("file-saver");

const mockSaveAs = saveAs as jest.Mock;

const mockDoc = {
  type: "VERIFIABLE_DOCUMENT",
  contractAddress: "",
  fileName: "test",
  payload: {},
  rawDocument: {},
  wrappedDocument: { data: "test document" },
} as WrappedDocument;

describe("publishedTag", () => {
  it("should render correctly with the given doc", () => {
    render(<PublishedTag doc={mockDoc} />);

    expect(screen.getAllByText("test.tt")).toHaveLength(1);
    expect(screen.getAllByText("(24 B)")).toHaveLength(1);
  });

  it("should generate the 'href' accordingly for download", () => {
    mockSaveAs;
    render(<PublishedTag doc={mockDoc} />);

    expect(screen.getAllByText("Download")).toHaveLength(1);
    fireEvent.click(screen.getByTestId("download-file-button"));
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
  });
});
