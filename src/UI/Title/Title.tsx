import styled from "@emotion/styled";
import React from "react";
import { vars } from "../../styles";

interface TitleProps {
  children?: React.ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const StandardTitle = ({ className, children }: TitleProps) => {
  return <div className={className}>{children}</div>;
};

export const Title = styled(StandardTitle)`
  font-weight: bold;
  font-size: 28px;
  color: ${vars.greyDark};
  margin-bottom: 32px;
`;
