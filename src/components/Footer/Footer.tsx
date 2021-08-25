import { FunctionComponent } from "react";

import { Footer as FooterComponent, FooterColumnItemProps } from "@govtechsg/tradetrust-ui-components";
import { NavLink } from "react-router-dom";
import { ExternalLink } from "react-feather";
import { URLS } from "../../constants/Urls";

const sharedStyles = `text-sm text-cloud-500`;

const renderNavLink = ({ label, to }: FooterColumnItemProps) => {
  return (
    <NavLink className={sharedStyles} to={to}>
      {label}
    </NavLink>
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

export const Footer: FunctionComponent<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const tradeTrustUrl = isLoggedIn ? URLS.DEV : URLS.MAIN;

  const data = [
    {
      category: "Utilities",
      items: [
        { label: "Verify Documents", to: `${tradeTrustUrl}/verify`, render: renderExternalLink },
        { label: "Create Documents", to: "/", render: renderNavLink },
      ],
    },
    {
      category: "Resources",
      items: [
        { label: "Webinars", to: `${tradeTrustUrl}/learn`, render: renderExternalLink },
        { label: "News", to: `${tradeTrustUrl}/news`, render: renderExternalLink },
        { label: "Events", to: `${tradeTrustUrl}/event`, render: renderExternalLink },
      ],
    },
    {
      category: "Support",
      items: [
        { label: "Github", to: "https://github.com/TradeTrust/tradetrust-website", render: renderExternalLink },
        { label: "Documentation", to: "https://docs.tradetrust.io/", render: renderExternalLink },
        { label: "Contact", to: `${tradeTrustUrl}/contact`, render: renderExternalLink },
        { label: "FAQ", to: `${tradeTrustUrl}/faq`, render: renderExternalLink },
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
  return (
    <FooterComponent
      className="px-7 md:py-0 md:pt-6"
      copyright={"Copyright © 2021 TradeTrust"}
      title="TradeTrust"
      data={data}
    />
  );
};
