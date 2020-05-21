import React, { FunctionComponent } from "react";

export const Container: FunctionComponent = ({ children }) => {
  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto">{children}</div>
    </div>
  );
};
