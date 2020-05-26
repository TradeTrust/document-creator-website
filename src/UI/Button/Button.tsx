import styled from "@emotion/styled";
import { mixin } from "../../styles";

export const Button = styled.button`
  box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  ${mixin.fontRobotoBold()}
  ${mixin.fontSize(18)}
  display: inline-block;
  vertical-align: middle;
  letter-spacing: 0.01rem;
  outline: none;
  min-height: 40px;
  margin-left: 8px;
  margin-right: 8px;

  &:not(:disabled):not(.disabled):active,
  &:focus,
  &.focus,
  &:hover,
  &:active,
  &.active {
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
  }

  &[disabled] {
    pointer-events: none;
    box-shadow: none;
  }

  :first-of-type {
    margin-left: 0;
  }

  :last-child {
    margin-right: 0;
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
