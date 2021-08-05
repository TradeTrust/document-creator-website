import { FunctionComponent, useState, useEffect } from "react";
import { Redirect } from "react-router";
import { useConfigContext } from "../../common/context/config";
import { RevokeDocumentDropZone } from "./RevokeDocumentDropZone/RevokeDocumentDropZone";
import { RevokeDocumentTileArea } from "./RevokeDocumentTileArea/RevokeDocumentTileArea";
import { utils } from "@govtechsg/open-attestation";
import { RevokeConfirmationModal } from "./RevokeConfirmationModal";
import { RevokedScreen } from "./RevokedScreen/RevokedScreen";
import { verificationBuilder, isValid, VerificationFragment, openAttestationVerifiers } from "@govtechsg/oa-verify";
import { DocumentUploadState } from "../../constants/DocumentUploadState";

const getNotRevokeFragment = (fragments: VerificationFragment[]): VerificationFragment[] =>
  fragments.filter(
    (status) => status.name !== "OpenAttestationEthereumDocumentStoreRevoked" && status.status !== "SKIPPED"
  );

export const RevokeContainer: FunctionComponent = () => {
  const { config, setConfig } = useConfigContext();
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
        const network = config?.network || "homestead";
        if (network !== "local") {
          const verify = verificationBuilder(openAttestationVerifiers, { network: network });
          const fragments = await verify(revokeDocuments[0]);
          const notRevokeFragments = getNotRevokeFragment(fragments);
          const hashValid = isValid(fragments, ["DOCUMENT_INTEGRITY"]);
          const issuedValid = isValid(notRevokeFragments, ["DOCUMENT_STATUS"]);
          const identityValid = isValid(fragments, ["ISSUER_IDENTITY"]);
          const isDocumentValid = hashValid && issuedValid && identityValid;

          if (!isDocumentValid) {
            setErrorMessage("Error: Document is not valid, please use a valid document.");
            setRevokeDocuments([]);
            setDocumentUploadState(DocumentUploadState.ERROR);
          } else {
            setErrorMessage("");
            setDocumentUploadState(DocumentUploadState.DONE);
          }
        } else {
          setErrorMessage("");
          setDocumentUploadState(DocumentUploadState.DONE);
        }
      };

      if (!isDocumentRevokable) {
        setErrorMessage("Error: Document is not revokable, please use a revokable document.");
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
    setRevokeStep(2);
    setShowConfirmationModal(false);
  };
  const revokeAnotherDocument = () => {
    setRevokeStep(1);
    setRevokeDocuments([]);
    setFileName("");
    setErrorMessage("");
    setShowConfirmationModal(false);
  };

  const onLogout = () => {
    revokeAnotherDocument();
    setConfig(undefined);
  };

  return (
    <>
      <RevokeConfirmationModal
        revokingDocument={revokingDocument}
        show={showConfirmationModal}
        closeRevokeConfirmationModal={() => setShowConfirmationModal(false)}
      />
      {revokeStep === 1 && (
        <>
          {revokeDocuments && revokeDocuments.length > 0 && documentUploadState === DocumentUploadState.DONE ? (
            <RevokeDocumentTileArea
              revokeDocuments={revokeDocuments}
              fileName={fileName}
              onShowConfirmation={() => setShowConfirmationModal(true)}
              documentUploadState={documentUploadState}
              onBack={revokeAnotherDocument}
            />
          ) : (
            <RevokeDocumentDropZone
              setRevokeDocuments={setRevokeDocuments}
              errorMessage={errorMessage}
              setFileName={setFileName}
              documentUploadState={documentUploadState}
              setDocumentUploadState={setDocumentUploadState}
            />
          )}
        </>
      )}
      {revokeStep === 2 && (
        <RevokedScreen
          config={config}
          revokeDocuments={revokeDocuments}
          revokeAnotherDocument={revokeAnotherDocument}
          onLogout={onLogout}
          fileName={fileName}
        />
      )}
    </>
  );
};
