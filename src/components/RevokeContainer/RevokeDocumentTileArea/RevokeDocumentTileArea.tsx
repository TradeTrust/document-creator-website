import { FunctionComponent } from "react";
import { Wrapper } from "../../UI/Wrapper";
import { Title } from "../../UI/Title";
import { RevokeTag } from "../RevokeTag/RevokeTag";
import { Button } from "@govtechsg/tradetrust-ui-components";
import { DocumentUploadState } from "../../../constants/DocumentUploadState";
import { ChooseIssueOrRevoke } from "../../ChooseIssueOrRevoke";
import { ProgressBar } from "../../ProgressBar";

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
  const shouldEnableRevokeButton = revokeDocuments.length > 0 && documentUploadState === DocumentUploadState.DONE;
  const revokeButtonColor = shouldEnableRevokeButton ? "bg-red" : "bg-grey cursor-not-allowed";
  return (
    <Wrapper isMaxW={true}>
      <ChooseIssueOrRevoke />
      <ProgressBar step={1} totalSteps={2} title="Upload Document" />
      <Title className="mb-8">Confirm File</Title>
      <RevokeTag doc={revokeDocuments[0]} isPending={false} fileName={fileName} />
      <div className="flex justify-center mt-16">
        <Button
          onClick={onBack}
          data-testid="back-revoke-button"
          className={`w-auto px-8 text-blue mb-8 bg-white mr-4`}
          disabled={!shouldEnableRevokeButton}
        >
          Back
        </Button>
        <Button
          onClick={() => onShowConfirmation()}
          data-testid="revoke-button"
          className={`w-auto px-8 text-white mb-8 ${revokeButtonColor}`}
          disabled={!shouldEnableRevokeButton}
        >
          Revoke
        </Button>
      </div>
    </Wrapper>
  );
};
