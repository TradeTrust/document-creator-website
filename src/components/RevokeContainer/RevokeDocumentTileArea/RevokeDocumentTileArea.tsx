import { FunctionComponent } from "react";
import { Wrapper } from "../../UI/Wrapper";
import { Title } from "../../UI/Title";
import { ProcessedDocumentTag } from "../../ProcessDocumentScreen/ProcessedDocumentTag";
import { Button } from "@govtechsg/tradetrust-ui-components";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { IssueOrRevokeSelector } from "../../UI/IssueOrRevokeSelector";
import { ProgressBar } from "../../ProgressBar";
import { QueueType } from "../../../constants/QueueState";

interface RevokeDocumentTileArea {
  revokeDocuments: any[];
  fileName: string;
  onShowConfirmation: () => void;
  documentUploadState: DocumentUploadState;
  onBack: () => void;
}

export const RevokeDocumentTileArea: FunctionComponent<RevokeDocumentTileArea> = ({
  revokeDocuments,
  fileName,
  onShowConfirmation,
  documentUploadState,
  onBack,
}) => {
  const isDisabled = revokeDocuments.length <= 0 && documentUploadState !== DocumentUploadState.DONE;
  const revokeButtonColor = isDisabled ? "bg-gray cursor-not-allowed" : "bg-red";
  return (
    <Wrapper isMaxW={true}>
      <IssueOrRevokeSelector />
      <ProgressBar step={2} totalSteps={3} title="Confirm Document" />
      <Title className="mb-8">Confirm File</Title>
      <ProcessedDocumentTag doc={revokeDocuments[0]} isPending={false} fileName={fileName} type={QueueType.REVOKE} />
      <div className="flex justify-center mt-16">
        <Button
          onClick={onBack}
          data-testid="back-revoke-button"
          className={`w-auto px-8 text-blue-500 border border-gray-400 mb-8 bg-white mr-4`}
        >
          Back
        </Button>
        <Button
          onClick={() => onShowConfirmation()}
          data-testid="revoke-button"
          className={`w-auto px-8 bg-red-600 hover:bg-red-500 text-white mb-8 ${revokeButtonColor}`}
          disabled={isDisabled}
        >
          Revoke
        </Button>
      </div>
    </Wrapper>
  );
};
