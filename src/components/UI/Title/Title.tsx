import styled from "@emotion/styled";
import tw from "twin.macro";
import { mixin } from "../../../styles";

export const Title = styled.h1`
  ${mixin.fontRobotoBold}
  ${mixin.fontSize(28)}
  ${tw`text-cloud-900`}
`;

export const SecondaryTitle = styled.h1`
  ${mixin.fontSize(24)}
  ${tw`text-cloud-900`}
`;
