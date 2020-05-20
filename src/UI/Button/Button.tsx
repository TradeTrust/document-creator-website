import styled from "@emotion/styled";
import React from "react";
import { vars } from "../../styles";

interface ButtonProps {
  children?: React.ReactNode;
  key?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  dataTestid?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const StandardButton = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export const Button = styled(StandardButton)`
  color: ${vars.greyDark};
  box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  background-color: ${vars.white};
  font-weight: bold;
  font-size: 18px;
  padding: 16px;
  width: 100%;
  margin-left: 8px;
  margin-right: 8px;

  &:not(:disabled):not(.disabled):active,
  &:focus,
  &.focus,
  &:hover,
  &:active,
  &.active {
    color: ${vars.blue};
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
  }

  :first-of-type {
    margin-left: 0;
  }

  :last-child {
    margin-right: 0;
  }
`;
