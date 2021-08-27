import { Footer, FooterColumnItemProps } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { ExternalLink } from "react-feather";
import { NavLink } from "react-router-dom";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { URLS } from "../../constants/Urls";
import { ConfigFile } from "../../types";
import { getNetworkPath } from "../../utils";

const sharedStyles = `text-sm text-cloud-500`;

const renderNavLink = ({ label, to }: FooterColumnItemProps) => {
  return (
    <NavLink className={sharedStyles} to={to}>
      {label}
    </NavLink>
  );
};

const renderExternalLinkWithoutIcon = ({ label, to }: FooterColumnItemProps) => {
  return (
    <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
      <p className={`${sharedStyles} mr-1`}>{label}</p>
    </a>
  );
};

const renderExternalLink = ({ label, to }: FooterColumnItemProps) => {
  return (
    <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
      <p className={`${sharedStyles} mr-1`}>{label}</p>
      <div className={`w-auto`}>
        <ExternalLink size={12} color={"#89969F"} />
      </div>
    </a>
  );
};

const getData = (configFile?: ConfigFile) => {
  const networkPath = getNetworkPath(configFile?.network);

  const data = [
    {
      category: "Utilities",
      items: [
        { label: "Verify Documents", to: `${networkPath}/verify`, render: renderExternalLinkWithoutIcon },
        { label: "Create Documents", to: "/", render: renderNavLink },
      ],
    },
    {
      category: "Resources",
      items: [
        { label: "Webinars", to: `${networkPath}/learn`, render: renderExternalLinkWithoutIcon },
        { label: "News", to: `${networkPath}/news`, render: renderExternalLinkWithoutIcon },
        { label: "Events", to: `${networkPath}/events`, render: renderExternalLinkWithoutIcon },
      ],
    },
    {
      category: "Support",
      items: [
        { label: "Github", to: URLS.GITHUB, render: renderExternalLink },
        { label: "Documentation", to: URLS.DOCS, render: renderExternalLink },
        { label: "Contact", to: `${networkPath}/contact`, render: renderExternalLinkWithoutIcon },
        { label: "FAQ", to: `${networkPath}/faq`, render: renderExternalLinkWithoutIcon },
      ],
    },
    {
      category: "Settings",
      items: [
        { label: "Address Book", to: "/settings/address-book", render: renderNavLink },
        { label: "Address Book Resolver", to: "/settings/address-resolver", render: renderNavLink },
      ],
    },
  ];

  return data;
};

export const FooterBar: FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  const data = getData(configFile);

  return (
    <div className="bg-cerulean-50 pt-8">
      <Footer
        className="bg-white py-8 px-6"
        title={"TradeTrust"}
        copyright={"Copyright \u00A9 2021 TradeTrust"}
        data={data}
      />
    </div>
  );
};
