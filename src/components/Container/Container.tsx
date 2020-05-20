import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";

export const Container: FunctionComponent = styled(({ children }) => {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto">{children}</div>
    </div>
  );
})``;
