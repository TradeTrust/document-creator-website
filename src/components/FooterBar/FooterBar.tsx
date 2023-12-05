import { Footer } from "@tradetrust-tt/tradetrust-ui-components";
import { FunctionComponent } from "react";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { URLS } from "../../constants/Urls";
import { getNetworkPath } from "../../utils";
import { NavLinkInterface, RenderExternalLink, RenderNavLink, BottomRenderExternalLink } from "./FooterBarLink";

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
        { label: "Verify Documents", to: `${networkPath}/verify`, render: RenderExternalLink },
        { label: "Create Documents", to: "/", render: RenderNavLink },
      ],
    },
    {
      category: "Resources",
      items: [
        { label: "Learn", to: `${networkPath}/learn`, render: RenderExternalLink },
        { label: "FAQ", to: `${networkPath}/faq`, render: RenderExternalLink },
        { label: "ETA", to: `${networkPath}/eta`, render: RenderExternalLink },
      ],
    },
    {
      category: "News & Event",
      items: [
        { label: "News", to: `${networkPath}/news`, render: RenderExternalLink },
        { label: "Events", to: `${networkPath}/events`, render: RenderExternalLink },
      ],
    },
    {
      category: "Support",
      items: [
        { label: "Github", to: URLS.GITHUB, render: RenderExternalLink },
        { label: "Documentation", to: URLS.DOCS, render: RenderExternalLink },
        { label: "Contact", to: `${networkPath}/contact`, render: RenderExternalLink },
        { label: "FAQ", to: `${networkPath}/faq`, render: RenderExternalLink },
      ],
    },
    {
      category: "Settings",
      items: [
        { label: "Address Book", to: "/settings/address-book", render: RenderNavLink },
        { label: "Address Book Resolver", to: "/settings/address-resolver", render: RenderNavLink },
      ],
    },
  ];
};

const legalData = (networkPath: string) => {
  return {
    copyright: "Copyright \u00A9 2021 TradeTrust",
    items: [
      { label: "Privacy Policy", to: `${networkPath}/privacy-policy`, render: BottomRenderExternalLink },
      { label: "Terms of use", to: `${networkPath}/terms-of-use`, render: BottomRenderExternalLink },
    ],
  };
};

export const FooterBar: FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  const networkPath = getNetworkPath(configFile?.network) || "https://tradetrust.io";
  const data = getData(networkPath);

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
