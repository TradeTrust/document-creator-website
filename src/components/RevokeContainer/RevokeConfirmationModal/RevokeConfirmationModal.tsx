import { FunctionComponent } from "react";
import { ConfirmModal } from "../../ConfirmModal";

interface RevokeConfirmationModalProps {
  revokingDocument: () => void;
  show: boolean;
  closeRevokeConfirmationModal: () => void;
  fileName: string;
}

export const RevokeConfirmationModal: FunctionComponent<RevokeConfirmationModalProps> = ({
  revokingDocument,
  show,
  closeRevokeConfirmationModal,
  fileName,
}) => {
  return (
    <ConfirmModal
      title="Revoke Document"
      description="Are you sure you want to revoke this document?"
      onClose={closeRevokeConfirmationModal}
      onConfirm={revokingDocument}
      onConfirmText="Revoke"
      show={show}
    />
  );
};
