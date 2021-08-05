import React, { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";

export const ChooseIssueOrRevoke: FunctionComponent = () => {
  const location = useLocation();
  const isRevokePath = location.pathname === "/revoke";
  const selectedStyle = "text-blue underline";
  const unselectedStyle = "";

  return (
    <div className="space-x-6 text-gray-500 text-lg font-medium mb-4">
      <Link to="/forms-selection" className={!isRevokePath ? selectedStyle : unselectedStyle}>
        Issue Document
      </Link>
      <Link to="/revoke" data-testid="choose-revoke-button" className={isRevokePath ? selectedStyle : unselectedStyle}>
        Revoke Document
      </Link>
    </div>
  );
};
