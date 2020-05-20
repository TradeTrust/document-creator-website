import styled from "@emotion/styled";
import { darken, lighten, rgba } from "polished";
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

interface BaseStyleButtonProps {
  bgColor: string;
  textColor: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const baseStyleButton = ({ bgColor, textColor }: BaseStyleButtonProps) => {
  // ${mixin.fontSourcesansproBold()}
  // ${mixin.fontSize(18)};
  return `
    font-size: 18px;
    transition: background-color 0.3s ${vars.easeOutCubic}, color 0.3s ${
    vars.easeOutCubic
  }, box-shadow 0.3s ${vars.easeOutCubic};
    display: inline-block;
    vertical-align: middle;
    outline: none;
    border: 0;
    padding: 6px 12px;
    letter-spacing: 0.01rem;
    min-height: 40px;
    cursor: pointer;
    border-radius: ${vars.buttonRadius};
    box-shadow: 0 2px 8px ${rgba(vars.black, 0.15)};
    background-color: ${bgColor};
    color: ${textColor};

    &:hover {
      background-color: ${darken(0.2, bgColor)};
    }

    &[disabled] {
      pointer-events: none;
      box-shadow: none;
      background-color: ${lighten(0.25, bgColor)};
      color: ${lighten(0.25, textColor)};
    }

    p {
      margin-top: 0;
      margin-bottom: 0;
    }

    svg {
      display: block;
      width: 100%;
      max-width: 24px;
    }
  `;
};

export const ButtonSolidWhiteOrange = styled(StandardButton)`
  ${baseStyleButton({
    bgColor: vars.white,
    textColor: vars.orange,
  })}
`;
