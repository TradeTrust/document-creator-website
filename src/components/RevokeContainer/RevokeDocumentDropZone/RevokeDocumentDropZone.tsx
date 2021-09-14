import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { Wrapper } from "../../UI/Wrapper";
import { ProgressBar } from "../../ProgressBar";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { DropZone } from "../../UI/DropZone";
import { ContentFrame } from "../../UI/ContentFrame";
import { Card } from "../../UI/Card";

const { stack } = getLogger("RevokeDocumentDropZone");

interface RevokeDocumentDropZone {
  setRevokeDocuments: (revokeDocuments: any) => void;
  errorMessage?: string;
  setFileName: (fileName: string) => void;
  documentUploadState: DocumentUploadState;
  setDocumentUploadState: (documentUploadState: DocumentUploadState) => void;
}

export const RevokeDocumentDropZone: FunctionComponent<RevokeDocumentDropZone> = ({
  setRevokeDocuments,
  errorMessage,
  setFileName,
  documentUploadState,
  setDocumentUploadState,
}) => {
  const onDrop = async (files: File[]): Promise<void> => {
    try {
      const file = files[0];
      setDocumentUploadState(DocumentUploadState.LOADING);
      setFileName(file.name);
      const revokeDocument = await readFileAsJson<any>(file);
      setRevokeDocuments([revokeDocument]);
    } catch (e) {
      setDocumentUploadState(DocumentUploadState.ERROR);
      stack(e);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, maxFiles: 1 });

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
          <div {...getRootProps()} data-testid="revoke-dropzone">
            <input data-testid="revoke-document-drop-zone" {...getInputProps()} />
            <DropZone
              isDragActive={isDragActive}
              error={
                (errorMessage !== undefined && errorMessage.length > 0) ||
                documentUploadState === DocumentUploadState.ERROR
              }
            >
              {documentUploadState === DocumentUploadState.LOADING && (
                <div className="py-8 flex flex-col items-center" data-testid="dropzone-loader">
                  <LoaderSpinner primary="#3B8CC5" />
                  <div className="mt-4 text-cerulean font-bold">Verifying Document</div>
                </div>
              )}
              <>
                {documentUploadState !== DocumentUploadState.LOADING && (
                  <img className="mb-12" src={"/dropzone-graphic.png"} />
                )}
                {documentUploadState === DocumentUploadState.ERROR && (
                  <div className="max-w-lg text-rose font-bold text-lg mb-4" data-testid="error-message">
                    {errorMessage
                      ? errorMessage
                      : "Document cannot be read. Please check that you have a valid document"}
                  </div>
                )}
                {documentUploadState !== DocumentUploadState.LOADING && (
                  <>
                    <div className="font-bold text-lg text-cloud-900" data-testid="dropzone-description">
                      Drop your TradeTrust document to revoke it
                    </div>
                    <div className="mt-4">or</div>
                  </>
                )}
                {documentUploadState !== DocumentUploadState.LOADING && (
                  <Button className="bg-cerulean text-white hover:bg-cerulean-500 mt-4 px-3">Select Document</Button>
                )}
              </>
            </DropZone>
          </div>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
