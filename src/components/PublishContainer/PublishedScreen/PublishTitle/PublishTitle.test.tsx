import { render, screen } from "@testing-library/react";
import React from "react";
import { WrappedDocument } from "../../../../types";
import { PublishTitle } from "./PublishTitle";

const mockPublishedDocuments = [
  {
    contractAddress: "",
    fileName: "Document-1",
    payload: {},
    type: "VERIFIABLE_DOCUMENT",
    rawDocument: {},
    wrappedDocument: {
      data: {},
      signature: {},
      version: "",
    },
  },
] as WrappedDocument[];

describe("publishTitle", () => {
  it("should display 'publishing' when publishState is 'PENDING_CONFIRMATION'", () => {
    render(
      <PublishTitle
        publishState={"PENDING_CONFIRMATION"}
        publishedDocuments={mockPublishedDocuments}
      />
    );

    expect(screen.queryAllByText("Publishing document(s)...")).toHaveLength(1);
  });

  it("should display 'success' when publishState is 'CONFIRMED' and there are publish documents", () => {
    render(<PublishTitle publishState={"CONFIRMED"} publishedDocuments={mockPublishedDocuments} />);

    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
  });

  it("should display 'fail' when publishState is 'CONFIRMED' and there are no publish documents", () => {
    render(<PublishTitle publishState={"CONFIRMED"} publishedDocuments={[]} />);

    expect(screen.queryAllByText("Document(s) failed to issue")).toHaveLength(1);
  });

  it("should display 'preparing' when publishState is 'INITIALIZED'", () => {
    render(<PublishTitle publishState={"CONFIINITIALIZEDRMED"} publishedDocuments={[]} />);

    expect(screen.queryAllByText("Please wait while we prepare your document(s)")).toHaveLength(1);
  });
});
