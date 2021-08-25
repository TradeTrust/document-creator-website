import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import tw from "twin.macro";
import { useLockBodyScroll } from "../../common/hook/useLockBodyScroll";

export enum ModalSize {
  SM = "sm",
  MD = "md",
  LG = "lg",
}

interface ModalDialogProps {
  className?: string;
  close: () => void;
  children?: React.ReactNode;
  size?: ModalSize;
  rounded?: boolean;
}

export const ModalDialogUnStyled: FunctionComponent<ModalDialogProps> = ({
  className,
  close,
  children,
  size = ModalSize.SM,
  rounded,
}) => {
  useLockBodyScroll();

  return (
    <>
      <div className={className} data-testid="modal-dialog">
        <div className={`modal-content ${size} p-6${rounded ? ` rounded-lg` : ``}`}>{children}</div>
        <div className="modal-backdrop bg-black bg-opacity-70" data-testid="modal-backdrop" onClick={() => close()} />
      </div>
    </>
  );
};

export const ModalDialog = styled(ModalDialogUnStyled)`
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;

  .modal-content {
    position: relative;
    z-index: 15;
    ${tw`bg-white`}
  }

  .modal-content.sm {
    max-width: 500px;
  }

  .modal-content.md {
    max-width: 650px;
  }

  .modal-content.lg {
    max-width: 800px;
  }

  .modal-cross {
    ${tw`flex flex-row-reverse`}
  }

  .modal-backdrop {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
