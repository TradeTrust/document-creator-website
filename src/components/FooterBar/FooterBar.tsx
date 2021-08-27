import { Footer, FooterColumnItemProps } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { ExternalLink } from "react-feather";
import { NavLink } from "react-router-dom";
import { URLS } from "../../constants/Urls";
import { Config } from "../../types";

interface FooterBarProps {
  config?: Config;
}

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

const getData = (config?: Config) => {
  let tradeTrustUrl = `${URLS.MAIN}`;

  if (config) {
    const { network } = config;

    switch (network) {
      case "local":
        break;
      case "rinkeby":
        tradeTrustUrl = `https://rinkeby.tradetrust.io`;
        break;
      case "ropsten":
        tradeTrustUrl = `https://dev.tradetrust.io`;
        break;
      default:
        console.log("Network not supported!");
    }
  }

  const data = [
    {
      category: "Utilities",
      items: [
        { label: "Verify Documents", to: `${tradeTrustUrl}/verify`, render: renderExternalLinkWithoutIcon },
        { label: "Create Documents", to: "/", render: renderNavLink },
      ],
    },
    {
      category: "Resources",
      items: [
        { label: "Webinars", to: `${tradeTrustUrl}/learn`, render: renderExternalLinkWithoutIcon },
        { label: "News", to: `${tradeTrustUrl}/news`, render: renderExternalLinkWithoutIcon },
        { label: "Events", to: `${tradeTrustUrl}/events`, render: renderExternalLinkWithoutIcon },
      ],
    },
    {
      category: "Support",
      items: [
        { label: "Github", to: URLS.GITHUB, render: renderExternalLink },
        { label: "Documentation", to: URLS.DOCS, render: renderExternalLink },
        { label: "Contact", to: `${tradeTrustUrl}/contact`, render: renderExternalLinkWithoutIcon },
        { label: "FAQ", to: `${tradeTrustUrl}/faq`, render: renderExternalLinkWithoutIcon },
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

<<<<<<< HEAD
export const FooterBar: FunctionComponent<FooterBarProps> = ({ config }) => {
  const data = getData(config);
=======
export const FooterBar: FunctionComponent<FooterBarProps> = ({ isLoggedIn }) => {
  const data = getData(isLoggedIn);
>>>>>>> 0d1ed495627e14c0d819bc9f3ca8ef0984373ae2

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
