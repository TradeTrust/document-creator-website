import { Button, LoaderSpinner } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { useDropzone } from "react-dropzone";
import { readFileAsJson } from "../../../common/utils";
import { getLogger } from "../../../utils/logger";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";
import { ProgressBar } from "../../ProgressBar";
import { ChooseIssueOrRevoke } from "../../ChooseIssueOrRevoke";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";

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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const dropZoneCSS =
    errorMessage || documentUploadState === DocumentUploadState.ERROR
      ? `border-dashed border-2 items-center border-red flex flex-col pt-16 pb-16 px-4 text-center ${
          isDragActive ? "bg-grey-300" : "bg-red-100"
        }`
      : `border-dashed border-2 items-center border-grey-300 flex flex-col pt-16 pb-16 px-4 text-center ${
          isDragActive ? "bg-grey-300" : "bg-white"
        }`;

  return (
    <Wrapper isMaxW={true}>
      <ChooseIssueOrRevoke />
      <ProgressBar step={1} totalSteps={2} title="Upload Document" />
      <Title className="mb-8">Revoke Document</Title>
      <div {...getRootProps()} data-testid="revoke-dropzone">
        <input data-testid="revoke-document-drop-zone" {...getInputProps()} />
        <div className={dropZoneCSS}>
          {documentUploadState === DocumentUploadState.LOADING ? (
            <div className="py-12" data-testid="dropzone-loader">
              <LoaderSpinner />
            </div>
          ) : (
            <>
              {documentUploadState === DocumentUploadState.ERROR && (
                <div className="max-w-lg text-red font-bold text-lg" data-testid="error-message">
                  {errorMessage ? errorMessage : "Error: File cannot be read"}
                </div>
              )}
              {!errorMessage && documentUploadState !== DocumentUploadState.ERROR && (
                <div className="font-bold text-lg text-grey-800" data-testid="dropzone-description">
                  Drag and drop file here
                </div>
              )}
              <div className="text-base text-grey-800 my-4">
                {documentUploadState === DocumentUploadState.ERROR ? "Please try again." : "or"}
              </div>
              <Button className="bg-white text-orange hover:text-orange-600 border-grey-300 px-12">Browse Files</Button>
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
