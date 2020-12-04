import React, { FunctionComponent } from "react";

export const Container: FunctionComponent = ({ children }) => {
  return (
    <main className="bg-blue-300">
      <div className="container">{children}</div>
    </main>
  );
};
