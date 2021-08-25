import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";

interface IssueOrRevokeSelectorProps {
  createLink?: string;
  revokeLink?: string;
}

export const IssueOrRevokeSelector: FunctionComponent<IssueOrRevokeSelectorProps> = ({
  createLink = "/forms-selection",
  revokeLink = "/revoke",
}) => (
  <div className="space-x-6 text-cloud-900 text-lg">
    <NavLink to={createLink} activeClassName="text-blue underline font-bold">
      Create Document
    </NavLink>
    <NavLink to={revokeLink} data-testid="choose-revoke-button" activeClassName="text-blue underline font-bold">
      Revoke Document
    </NavLink>
  </div>
);
