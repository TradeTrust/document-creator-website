import { Button, LoaderSpinner, ProgressBar } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, useEffect, useState } from "react";
import { readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { Wrapper } from "../../UI/Wrapper";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { StyledDropZone } from "../../UI/StyledDropZone";
import { ContentFrame } from "../../UI/ContentFrame";
import { Card } from "../../UI/Card";
import { primary } from "../../../constants/styles";

const { stack } = getLogger("RevokeDocumentDropZone");

interface RevokeDocumentDropZone {
  setRevokeDocuments: (revokeDocuments: any) => void;
  errorMessages: string[];
  setErrorMessages: (errorMessage: string[]) => void;
  setFileName: (fileName: string) => void;
  documentUploadState: DocumentUploadState;
  setDocumentUploadState: (documentUploadState: DocumentUploadState) => void;
}

export const RevokeDocumentDropZone: FunctionComponent<RevokeDocumentDropZone> = ({
  setRevokeDocuments,
  errorMessages,
  setErrorMessages,
  setFileName,
  documentUploadState,
  setDocumentUploadState,
}) => {
  const [fileErrors, setFileErrors] = useState<Error[]>();

  useEffect(() => {
    if (documentUploadState === DocumentUploadState.ERROR) {
      const readFileError =
        errorMessages.length > 0
          ? errorMessages.map((errorMessage) => new Error(errorMessage))
          : [new Error("Document cannot be read. Please check that you have a valid document")];
      setFileErrors(readFileError);
    } else {
      setFileErrors(undefined);
    }
  }, [documentUploadState, errorMessages]);

  const onDropAccepted = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      setDocumentUploadState(DocumentUploadState.LOADING);
      setFileName(file.name);
      const revokeDocument = await readFileAsJson<any>(file);
      setRevokeDocuments([revokeDocument]);
    } catch (e) {
      if (e instanceof Error) {
        setDocumentUploadState(DocumentUploadState.ERROR);
        setErrorMessages(["Document cannot be read. Please check that you have a valid document"]);
        stack(e);
      }
    }
  };

  const defaultStyle = "bg-white";
  const activeStyle = "border-green-400 bg-green-50";
  const acceptStyle = "border-green-400 bg-green-50";
  const dropzoneOptions = {
    onDropAccepted,
    maxFiles: 1,
  };

  return (
    <Wrapper>
      <div className="mb-4">
        <IssueOrRevokeSelector activeType="revoke" />
      </div>
      <ContentFrame>
        <Card>
          <ProgressBar step={1} totalSteps={3} />
          <h3 data-testid="revoke-title" className="my-6">
            Upload Document
          </h3>
          <StyledDropZone
            dropzoneOptions={dropzoneOptions}
            defaultStyle={defaultStyle}
            activeStyle={activeStyle}
            acceptStyle={acceptStyle}
            fileErrors={fileErrors}
            dropzoneIcon={documentUploadState !== DocumentUploadState.LOADING ? "/dropzone-graphic.png" : ""}
            dataTestId="revoke-file-dropzone"
          >
            {documentUploadState !== DocumentUploadState.LOADING && (
              <>
                <h4 className="text-cloud-800" data-testid="dropzone-description">
                  Drop your TradeTrust document to revoke it
                </h4>
                <div className="mt-4">or</div>
              </>
            )}
            {documentUploadState !== DocumentUploadState.LOADING && (
              <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800 mt-4">Select Document</Button>
            )}
            {documentUploadState === DocumentUploadState.LOADING && (
              <div className="py-8 h-72 flex flex-col items-center justify-center" data-testid="dropzone-loader">
                <LoaderSpinner primary={primary} width="40px" />
                <h4 className="mt-8 text-cerulean-500">Verifying Document</h4>
              </div>
            )}
          </StyledDropZone>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
