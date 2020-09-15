import styled from "@emotion/styled";
import tw from "twin.macro";
import { mixin } from "../../../styles";

export const Button = styled.button`
  box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
  ${tw`rounded inline-block align-middle tracking-normal outline-none`}
  ${mixin.fontRobotoBold()}
  ${mixin.fontSize(18)}
  min-height: 40px;

  &:not(:disabled):not(.disabled):active,
  &:focus,
  &.focus,
  &:hover,
  &:active,
  &.active {
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
  }

  &[disabled] {
    ${tw`pointer-events-none shadow-none text-grey-lighter bg-lightgrey-lighter`}
  }

  p {
    margin-top: 0;
    margin-bottom: 0;
  }
`;
