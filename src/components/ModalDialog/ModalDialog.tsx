import styled from "@emotion/styled";
import { rgba } from "polished";
import React, { FunctionComponent, useEffect } from "react";
import tw from "twin.macro";
import { vars } from "../../styles";

interface ModalDialogProps {
  className?: string;
  show: boolean;
  close: () => void;
  children?: React.ReactNode;
}

export const ModalDialogUnStyled: FunctionComponent<ModalDialogProps> = ({
  className,
  show,
  close,
  children,
}) => {
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "visible";
  }, [show]);

  return (
    <>
      {show && (
        <div className={className}>
          <div className="modal-content p-6">{children}</div>
          <div className="modal-backdrop" onClick={() => close()} />
        </div>
      )}
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
    max-width: 500px;
    ${tw`bg-white`}
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
    background-color: ${rgba(vars.black, 0.7)};
  }
`;
