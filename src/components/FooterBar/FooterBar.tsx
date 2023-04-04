import { Footer, FooterColumnItemProps } from "@govtechsg/tradetrust-ui-components";
import { FunctionComponent, useEffect, useState } from "react";
import { ExternalLink } from "react-feather";
import { NavLink } from "react-router-dom";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { URLS } from "../../constants/Urls";
import { getNetworkPath } from "../../utils";

const sharedStyles = `text-sm text-cloud-500 hover:text-cerulean-500`;

interface NavLinkInterface {
  (props: FooterColumnItemProps): JSX.Element;
}

const renderNavLink: NavLinkInterface = ({ label, to }) => {
  return (
    <NavLink className={sharedStyles} to={to}>
      {label}
    </NavLink>
  );
};

// This component is not being used at the moment, but if you ever want an external link without the icon please use this component.
// const renderExternalLinkWithoutIcon = ({ label, to }: FooterColumnItemProps) => {
//   return (
//     <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
//       <p className={`${sharedStyles} mr-1`}>{label}</p>
//     </a>
//   );
// };

const renderExternalLink: NavLinkInterface = ({ label, to }) => {
  return (
    <a className="flex items-center" href={to} target={"_blank"} rel="noopener noreferrer">
      <p className={`${sharedStyles} mr-1`}>{label}</p>
      <div className="w-auto text-cloud-400">
        <ExternalLink size={12} />
      </div>
    </a>
  );
};

interface footerData {
  category: string;
  items: footerDataItems[];
}

interface footerDataItems {
  label: string;
  to: string;
  render: NavLinkInterface;
}

interface GetDataInterface {
  (networkPath: string): footerData[];
}

const getData: GetDataInterface = (networkPath: string) => {
  return [
    {
      category: "Utilities",
      items: [
        { label: "Verify Documents", to: `${networkPath}/verify`, render: renderExternalLink },
        { label: "Create Documents", to: "/", render: renderNavLink },
      ],
    },
    {
      category: "Resources",
      items: [
        { label: "Learn", to: `${networkPath}/learn`, render: renderExternalLink },
        { label: "FAQ", to: `${networkPath}/faq`, render: renderExternalLink },
        { label: "ETA", to: `${networkPath}/eta`, render: renderExternalLink },
      ],
    },
    {
      category: "News & Event",
      items: [
        { label: "News", to: `${networkPath}/news`, render: renderExternalLink },
        { label: "Events", to: `${networkPath}/events`, render: renderExternalLink },
      ],
    },
    {
      category: "Support",
      items: [
        { label: "Github", to: URLS.GITHUB, render: renderExternalLink },
        { label: "Documentation", to: URLS.DOCS, render: renderExternalLink },
        { label: "Contact", to: `${networkPath}/contact`, render: renderExternalLink },
        { label: "FAQ", to: `${networkPath}/faq`, render: renderExternalLink },
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
};

const bottomRender = ({ label, to }: FooterColumnItemProps): React.ReactElement => (
  <a href={to} className="text-cloud-500 text-sm px-4 border-r">
    {label}
  </a>
);

const legalData = (networkPath: string) => {
  return {
    copyright: "Copyright \u00A9 2021 TradeTrust",
    items: [
      { label: "Privacy Policy", to: `${networkPath}/privacy-policy`, render: bottomRender },
      { label: "Terms of use", to: `${networkPath}/terms-of-use`, render: bottomRender },
    ],
  };
};

export const FooterBar: FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  const [data, setData] = useState<footerData[]>();
  const [networkPath, setNetworkPath] = useState<string>("https://tradetrust.io");

  useEffect(() => {
    const networkP = getNetworkPath(configFile?.network);
    setData(getData(networkP));
    setNetworkPath(networkP);
  }, [configFile]);

  return (
    <div className="bg-cerulean-50 pt-8">
      <Footer
        className="bg-white py-8 px-6"
        logoUrl={"/tradetrust_logo.svg"}
        legalData={legalData(networkPath)}
        data={data}
      />
    </div>
  );
};
