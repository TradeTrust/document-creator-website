import { FunctionComponent, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { RevokeDocumentDropZone } from "./RevokeDocumentDropZone/RevokeDocumentDropZone";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea/RevokeDocumentTileArea";
import { utils } from "@govtechsg/open-attestation";
import { RevokeConfirmationModal } from "./RevokeConfirmationModal";
import { verificationBuilder, openAttestationVerifiers } from "@govtechsg/oa-verify";
import { DocumentUploadState } from "../../constants/DocumentUploadState";
import { ProcessDocumentScreen } from "../ProcessDocumentScreen";
import { QueueType } from "../../constants/QueueState";
import { errorMessageHandling } from "../../services/verify/fragments";
import { MESSAGES } from "../../constants/VerificationErrorMessages";

export const RevokeContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const [revokeDocuments, setRevokeDocuments] = useState([]);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [revokeStep, setRevokeStep] = useState(1);
  const [documentUploadState, setDocumentUploadState] = useState(DocumentUploadState.INITIALIZED);

  useEffect(() => {
    if (revokeDocuments.length > 0) {
      const isDocumentRevokable = utils.isDocumentRevokable(revokeDocuments[0]);

      const validateDocument = async () => {
        const network = config?.network || "";
        let isDocumentValid = false;

        if (network !== "local") {
          const verify = verificationBuilder(openAttestationVerifiers, { network: network });
          const fragments = await verify(revokeDocuments[0]);
          const errors = errorMessageHandling(fragments);

          if (errors.length > 0) {
            setErrorMessage(MESSAGES[errors[0]].failureMessage);
            setRevokeDocuments([]);
            setDocumentUploadState(DocumentUploadState.ERROR);
          } else {
            isDocumentValid = true;
          }
        }

        if (isDocumentValid) {
          setErrorMessage("");
          setRevokeStep(2);
          setDocumentUploadState(DocumentUploadState.DONE);
        }
      };

      if (!isDocumentRevokable) {
        setErrorMessage("Document is not revokable, please use a revokable document");
        setRevokeDocuments([]);
        setDocumentUploadState(DocumentUploadState.ERROR);
      } else {
        validateDocument();
      }
    }
  }, [config?.network, revokeDocuments]);

  if (!config) {
    return <Redirect to="/" />;
  }

  const revokingDocument = () => {
    setRevokeStep(3);
    setShowConfirmationModal(false);
  };
  const revokeAnotherDocument = () => {
    setRevokeStep(1);
    setRevokeDocuments([]);
    setFileName("");
    setErrorMessage("");
    setShowConfirmationModal(false);
    setDocumentUploadState(DocumentUploadState.INITIALIZED);
  };

  return (
    <>
      <RevokeConfirmationModal
        fileName={fileName}
        revokingDocument={revokingDocument}
        show={showConfirmationModal}
        closeRevokeConfirmationModal={() => setShowConfirmationModal(false)}
      />
      {revokeStep === 1 && (
        <RevokeDocumentDropZone
          setRevokeDocuments={setRevokeDocuments}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          setFileName={setFileName}
          documentUploadState={documentUploadState}
          setDocumentUploadState={setDocumentUploadState}
        />
      )}
      {revokeStep === 2 && (
        <RevokeDocumentTileArea
          revokeDocuments={revokeDocuments}
          fileName={fileName}
          onShowConfirmation={() => setShowConfirmationModal(true)}
          documentUploadState={documentUploadState}
          onBack={revokeAnotherDocument}
        />
      )}
      {revokeStep === 3 && (
        <ProcessDocumentScreen
          config={config}
          revokeDocuments={revokeDocuments}
          processAnotherDocument={revokeAnotherDocument}
          fileName={fileName}
          type={QueueType.REVOKE}
        />
      )}
    </>
  );
};
