import { FunctionComponent, useState } from "react";
import { RevokeDocumentDropZone } from "./RevokeDocumentDropZone";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { MemoryRouter } from "react-router";

export default {
  title: "Revoke/RevokeDocumentDropZone",
  component: RevokeDocumentDropZone,
  parameters: {
    componentSubtitle: "RevokeDocumentDropZone",
  },
};

export const Default: FunctionComponent = () => {
  const [revokeDocument, setRevokeDocument] = useState();
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [documentUploadState, setDocumentUploadState] = useState(DocumentUploadState.INITIALIZED);
  console.info(revokeDocument, fileName);

  return (
    <MemoryRouter>
      <RevokeDocumentDropZone
        setRevokeDocuments={setRevokeDocument}
        setFileName={setFileName}
        documentUploadState={documentUploadState}
        setDocumentUploadState={setDocumentUploadState}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </MemoryRouter>
  );
};
