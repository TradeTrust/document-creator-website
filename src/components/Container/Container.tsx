import React, { FunctionComponent } from "react";

export const Container: FunctionComponent = ({ children }) => {
  return (
    <div className="bg-blue-lighter min-h-screen">
      <div className="mx-auto">{children}</div>
    </div>
  );
};
