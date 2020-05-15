import React, { ReactElement } from "react";
import logo from "./logo.svg";

export const NavigationBar = (): ReactElement => {
  return (
    <div className="container mx-auto h-16 py-2">
      <img className="h-full" src={logo} alt="TradeTrust Logo" />
    </div>
  );
};
