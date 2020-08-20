import styled from "@emotion/styled";
import tw from "twin.macro";
import { mixin } from "../../../styles";

export const Title = styled.h1`
  ${mixin.fontRobotoBold}
  ${mixin.fontSize(28)}
  ${tw`text-grey-dark`}
`;
