import { render, screen } from "@testing-library/react";
import { QueueState, QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
import { ProcessDocumentTitle } from "./ProcessDocumentTitle";

const mockDocuments = [
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

describe("ProcessDocumentTitle", () => {
  it("should display 'preparing' when queueState is 'INITIALIZED'", () => {
    render(<ProcessDocumentTitle queueState={QueueState.INITIALIZED} documents={[]} type={QueueType.ISSUE} />);

    expect(screen.queryAllByText("Please wait while we prepare your document(s)")).toHaveLength(1);
  });

  it("should display 'publishing' when queueState is 'PENDING' for issuing documents", () => {
    render(<ProcessDocumentTitle queueState={QueueState.PENDING} documents={mockDocuments} type={QueueType.ISSUE} />);

    expect(screen.queryAllByText("Publishing document(s)...")).toHaveLength(1);
  });
  it("should display 'revoking' when queueState is 'PENDING' for revoking documents", () => {
    render(<ProcessDocumentTitle queueState={QueueState.PENDING} documents={mockDocuments} type={QueueType.REVOKE} />);

    expect(screen.queryAllByText("Revoking document...")).toHaveLength(1);
  });

  it("should display 'success' when queueState is 'CONFIRMED' and there are publish documents", () => {
    render(<ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={mockDocuments} type={QueueType.ISSUE} />);

    expect(screen.queryAllByText("Document(s) issued successfully")).toHaveLength(1);
  });
  it("should display 'success' when queueState is 'CONFIRMED' and there are revoke documents", () => {
    render(
      <ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={mockDocuments} type={QueueType.REVOKE} />
    );

    expect(screen.queryAllByText("Document revoked successfully")).toHaveLength(1);
  });

  it("should display 'fail' when queueState is 'CONFIRMED' and there are no publish documents", () => {
    render(<ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={[]} type={QueueType.ISSUE} />);

    expect(screen.queryAllByText("Document(s) failed to issue")).toHaveLength(1);
  });
  it("should display 'fail' when queueState is 'CONFIRMED' and there are no revoke documents", () => {
    render(<ProcessDocumentTitle queueState={QueueState.CONFIRMED} documents={[]} type={QueueType.REVOKE} />);

    expect(screen.queryAllByText("Document failed to revoke")).toHaveLength(1);
  });
});
