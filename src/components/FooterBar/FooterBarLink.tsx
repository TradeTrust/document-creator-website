import { ExternalLink } from "react-feather";
import { NavLink } from "react-router-dom";
import { FooterColumnItemProps } from "@tradetrust-tt/tradetrust-ui-components";

const sharedStyles = `text-sm text-cloud-500 hover:text-cerulean-500`;

export interface NavLinkInterface {
  (props: FooterColumnItemProps): React.ReactElement;
}

export const RenderNavLink: NavLinkInterface = ({ label, to }) => {
  return (
    <NavLink className={sharedStyles} to={to}>
      {label}
    </NavLink>
  );
};

// This component is not being used at the moment, but if you ever want an external link without the icon please use this component.
// const RenderExternalLinkWithoutIcon = ({ label, to }: FooterColumnItemProps) => {
//   return (
//     <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
//       <p className={`${sharedStyles} mr-1`}>{label}</p>
//     </a>
//   );
// };

export const RenderExternalLink: NavLinkInterface = ({ label, to }) => {
  return (
    <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
      <p className={`${sharedStyles} mr-1`}>{label}</p>
      <div className="w-auto text-cloud-400">
        <ExternalLink size={12} />
      </div>
    </a>
  );
};

export const BottomRenderExternalLink: NavLinkInterface = ({ label, to }) => (
  <a href={to} className="text-cloud-500 text-sm px-4 border-r">
    {label}
  </a>
);
