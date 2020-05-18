import React, { FunctionComponent } from "react";
import logo from "./logo.svg";

interface NavigationBar {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBar> = ({ logout }) => {
  return (
    <div className="container mx-auto h-16 py-2 flex items-center justify-between">
      <img className="h-full" src={logo} alt="TradeTrust Logo" />
      {logout && <div className="cursor-pointer" onClick={logout}>Logout</div>}
    </div>
  );
};
