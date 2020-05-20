import styled from "@emotion/styled";
import React from "react";
import { Router } from "./Router";
import { base } from "./styles/base";

export const App: React.FunctionComponent = styled(({ className }) => {
  return (
    <div className={`${className} text-gray-800`}>
      <Router />
    </div>
  );
})`
  ${base()};
`;
