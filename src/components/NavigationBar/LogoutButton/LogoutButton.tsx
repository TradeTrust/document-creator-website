import { Button, ButtonSize } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, useState } from "react";
import { ConfirmModal } from "../../ConfirmModal";

interface LogoutButtonProps {
  logout: () => void;
}

export const LogoutButton: FunctionComponent<LogoutButtonProps> = ({ logout }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  return (
    <>
      <ConfirmModal
        show={showConfirmModal}
        title="Logout"
        description={
          <span className="font-normal text-cloud-900">
            Are you sure you wish to logout? This will delete <b>ALL</b> your current document(s).
          </span>
        }
        onConfirm={logout}
        onConfirmText="Logout"
        onClose={() => setShowConfirmModal(false)}
      />
      <Button
        data-testid="navbar-logout"
        onClick={() => setShowConfirmModal(true)}
        className="bg-white text-cerulean hover:bg-gray-50"
        size={ButtonSize.SM}
      >
        Logout
      </Button>
    </>
  );
};
