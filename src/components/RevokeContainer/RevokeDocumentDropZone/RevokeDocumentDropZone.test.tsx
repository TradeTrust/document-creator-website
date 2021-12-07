import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { RevokeDocumentDropZone } from "./RevokeDocumentDropZone";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { createFileTransferEvent } from "../../../utils/utils";

import sampleRevokableDocument from "../../../test/fixtures/sample-files/v2/wrapped/sample-wrapped-document.json";

describe("RevokeDocumentDropZone", () => {
  it("should fire setRevokeDocument, setFileName and setDocumentUploadState when a file is dropped", async () => {
    const setRevokeDocuments = jest.fn();
    const errorMessage = "";
    const setErrorMessage = jest.fn();
    const setFileName = jest.fn();
    const documentUploadState = DocumentUploadState.INITIALIZED;
    const setDocumentUploadState = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      </BrowserRouter>
    );
    const file = new File([JSON.stringify(sampleRevokableDocument)], "revokable-document.json", {
      type: "text/plain",
    });
    const data = createFileTransferEvent([file]);

    await act(async () => {
      const event = new Event("drop", { bubbles: true });
      Object.assign(event, data);
      fireEvent(screen.getByTestId("revoke-file-dropzone"), event);
      await waitFor(() => {
        expect(setRevokeDocuments).toHaveBeenCalledWith([sampleRevokableDocument]);
        expect(setFileName).toHaveBeenCalledWith("revokable-document.json");
        expect(setDocumentUploadState).toHaveBeenCalledTimes(1);
      });
    });
  });

  it("should display error when there is an error message", () => {
    const setRevokeDocuments = jest.fn();
    const errorMessage = "Some Error";
    const setErrorMessage = jest.fn();
    const setFileName = jest.fn();
    const documentUploadState = DocumentUploadState.ERROR;
    const setDocumentUploadState = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("file-error")).toHaveLength(1);
  });

  it("should display loader when documentUploadState is true", () => {
    const setRevokeDocuments = jest.fn();
    const errorMessage = "";
    const setErrorMessage = jest.fn();
    const setFileName = jest.fn();
    const documentUploadState = DocumentUploadState.LOADING;
    const setDocumentUploadState = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("dropzone-loader")).toHaveLength(1);
  });

  it("should not display loader when documentUploadState is DONE", () => {
    const setRevokeDocuments = jest.fn();
    const errorMessage = "";
    const setErrorMessage = jest.fn();
    const setFileName = jest.fn();
    const documentUploadState = DocumentUploadState.DONE;
    const setDocumentUploadState = jest.fn();

    render(
      <BrowserRouter>
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("dropzone-loader")).toHaveLength(0);
  });
});
