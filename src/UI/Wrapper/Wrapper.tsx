import styled from "@emotion/styled";
import React from "react";

interface WrapperProps {
  children?: React.ReactNode;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const StandardWrapper = ({ className, children }: WrapperProps) => {
  return <div className={className}>{children}</div>;
};

export const Wrapper = styled(StandardWrapper)`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: auto;
  padding-top: 32px;
`;
