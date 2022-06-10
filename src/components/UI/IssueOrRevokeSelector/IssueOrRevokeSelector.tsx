import { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { FlowSelectorTypes } from "../../../types";

interface IssueOrRevokeSelectorProps {
  activeType?: FlowSelectorTypes;
}

interface Link {
  type: FlowSelectorTypes;
  to: string;
  label: string;
}

export const IssueOrRevokeSelector: FunctionComponent<IssueOrRevokeSelectorProps> = ({ activeType = "issue" }) => {
  const links = [
    {
      type: "issue",
      label: "Create Document",
      to: "/forms-selection",
    },
    {
      type: "revoke",
      label: "Revoke Document",
      to: "/revoke",
    },
  ] as Link[];

  return (
    <div className="space-x-6 text-lg flex">
      {links.map((link) => (
        <NavLink data-testid={`${link.type}-selector`} key={link.to} to={link.to} className="text-cloud-800">
          {link.type === activeType ? (
            <h4 className="underline">{link.label}</h4>
          ) : (
            <div className="text-xl">{link.label}</div>
          )}
        </NavLink>
      ))}
    </div>
  );
};
