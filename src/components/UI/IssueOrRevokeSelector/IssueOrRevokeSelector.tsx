import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

export const IssueOrRevokeSelector: FunctionComponent = () => (
  <div className="space-x-6 text-cloud-900 text-lg mb-4">
    <NavLink to="/forms-selection" activeClassName="font-bold text-blue underline">
      Create Document
    </NavLink>
    <NavLink to="/revoke" data-testid="choose-revoke-button" activeClassName="font-bold text-blue underline">
      Revoke Document
    </NavLink>
  </div>
);
