import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

export const IssueOrRevokeSelector: FunctionComponent = () => (
  <div className="space-x-6 text-cloud-900 text-lg font-medium mb-4">
    <NavLink to="/forms-selection" activeClassName="text-blue underline">
      Issue Document
    </NavLink>
    <NavLink to="/revoke" data-testid="choose-revoke-button" activeClassName="text-blue underline">
      Revoke Document
    </NavLink>
  </div>
);
