import { render, screen } from "@testing-library/react";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea";
import sampleRevokableDocument from "../../../test/fixtures/sample-wrapped-document.json";
import { BrowserRouter } from "react-router-dom";

describe("RevokeDocumentTileArea", () => {
  it("should render correctly given the revoke documents", () => {
    const revokeDocuments = [sampleRevokableDocument];
    const fileName = "sample-revokable-document.json";

    render(
      <BrowserRouter>
        <RevokeDocumentTileArea revokeDocuments={revokeDocuments} fileName={fileName} />
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("file-name")).toHaveLength(1);
  });
});
