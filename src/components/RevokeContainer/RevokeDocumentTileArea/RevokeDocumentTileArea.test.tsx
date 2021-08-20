import { render, screen, fireEvent } from "@testing-library/react";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea";
import sampleRevokableDocument from "../../../test/fixtures/sample-wrapped-document.json";
import { BrowserRouter } from "react-router-dom";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";

describe("RevokeDocumentTileArea", () => {
  it("should render correctly given the revoke documents", () => {
    const revokeDocuments = [sampleRevokableDocument];
    const fileName = "sample-revokable-document.json";

    render(
      <BrowserRouter>
        <RevokeDocumentTileArea
          revokeDocuments={revokeDocuments}
          fileName={fileName}
          onShowConfirmation={() => {}}
          documentUploadState={DocumentUploadState.INITIALIZED}
          onBack={() => {}}
        />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("file-name")).toHaveLength(1);
  });

  it("should fire onBack function when back button is pressed", async () => {
    const revokeDocuments = [sampleRevokableDocument];
    const fileName = "sample-revokable-document.json";
    const mockBackFunction = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentTileArea
          revokeDocuments={revokeDocuments}
          fileName={fileName}
          onShowConfirmation={() => {}}
          documentUploadState={DocumentUploadState.DONE}
          onBack={mockBackFunction}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("back-revoke-button"));
    expect(mockBackFunction).toHaveBeenCalledTimes(1);
  });

  it("should fire onShowConfirmation function when revoke button is pressed", () => {
    const revokeDocuments = [sampleRevokableDocument];
    const fileName = "sample-revokable-document.json";
    const mockShowConfirmationModalFunction = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentTileArea
          revokeDocuments={revokeDocuments}
          fileName={fileName}
          onShowConfirmation={mockShowConfirmationModalFunction}
          documentUploadState={DocumentUploadState.DONE}
          onBack={() => {}}
        />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("revoke-button"));
    expect(mockShowConfirmationModalFunction).toHaveBeenCalledTimes(1);
  });
});
