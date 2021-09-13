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
  <div className="space-x-6 text-lg">
    <NavLink to={createLink} className="text-cloud-900" activeClassName="font-bold text-blue underline">
      Create Document
    </NavLink>
    <NavLink
      to={revokeLink}
      data-testid="choose-revoke-button"
      className="text-cloud-900"
      activeClassName="font-bold text-blue underline"
    >
      Revoke Document
    </NavLink>
  </div>
);
