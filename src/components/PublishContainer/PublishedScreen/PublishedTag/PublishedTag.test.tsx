import { render, screen } from "@testing-library/react";
import React from "react";
import { WrappedDocument } from "../../../../types";
import { PublishedTag } from "./PublishedTag";

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
    render(<PublishedTag doc={mockDoc} />);

    expect(screen.getAllByText("Download")).toHaveLength(1);
    expect(screen.getByText("Download").closest("a")).toHaveAttribute(
      "href",
      'data:text/json;charset=utf-8,{"data":"test document"}'
    );
  });
});
