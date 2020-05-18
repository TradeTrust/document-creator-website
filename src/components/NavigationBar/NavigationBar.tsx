import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg";

interface NavigationBar {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBar> = ({ logout }) => {
  return (
    <div className="container mx-auto h-16 py-2 flex items-center justify-between">
      <Link to="/" className="h-full">
        <img className="h-full" src={logo} alt="TradeTrust Logo" />
      </Link>
      {logout && (
        <div className="cursor-pointer" onClick={logout}>
          Logout
        </div>
      )}
    </div>
  );
};
