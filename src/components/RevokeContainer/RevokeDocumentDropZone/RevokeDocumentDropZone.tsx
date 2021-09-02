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
        <IssueOrRevokeSelector />
      </div>
      <ContentFrame>
        <h3 data-testid="revoke-title" className="mb-8 font-bold">
          Revoke Document
        </h3>
        <Card>
          <ProgressBar step={1} totalSteps={3} title="Upload Document" />
          <div className="my-6 text-2xl">Upload Document</div>
          <div {...getRootProps()} data-testid="revoke-dropzone">
            <input data-testid="revoke-document-drop-zone" {...getInputProps()} />
            <DropZone
              isDragActive={isDragActive}
              error={Boolean(errorMessage || documentUploadState === DocumentUploadState.ERROR)}
            >
              <img className="mb-12" src={"/dropzone-graphic.png"} />
              {documentUploadState === DocumentUploadState.LOADING && (
                <div className="py-8 flex flex-col items-center" data-testid="dropzone-loader">
                  <LoaderSpinner />
                  <div className="mt-4 text-blue">Verifying Document</div>
                </div>
              )}
              <>
                {documentUploadState === DocumentUploadState.ERROR && (
                  <div className="max-w-lg text-rose font-bold text-lg" data-testid="error-message">
                    <p>{errorMessage ? errorMessage : "Error: File cannot be read"}</p>
                    <p className="text-base text-gray-800 my-4 font-normal">Please try again</p>
                  </div>
                )}
                {documentUploadState === DocumentUploadState.INITIALIZED && (
                  <>
                    <div className="font-bold text-lg text-gray-800" data-testid="dropzone-description">
                      Drop your TradeTrust file to revoke the document
                    </div>
                    <div className="mt-4">or</div>
                  </>
                )}
                {documentUploadState !== DocumentUploadState.LOADING && (
                  <Button className="bg-cerulean text-white hover:bg-cerulean-500 border-gray-300 px-12 mt-4">
                    Browse Documents
                  </Button>
                )}
              </>
            </DropZone>
          </div>
        </Card>
      </ContentFrame>
    </Wrapper>
  );
};
