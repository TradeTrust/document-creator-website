import React, { FunctionComponent } from "react";
import { Settings } from "react-feather";
import { Link } from "react-router-dom";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import { Network } from "../../types";
import logo from "./logo.svg";

const homesteadUrlPath = "https://tradetrust.io";

interface NavItemsProps {
  id: string;
  label: string;
  path: string;
}

const navItems: NavItemsProps[] = [
  {
    id: "verify-documents",
    label: "Verify Documents",
    path: "/#verify-documents",
  },
  {
    id: "create-documents",
    label: "Create Documents",
    path: "/",
  },
  {
    id: "resources",
    label: "Resources",
    path: "/resources",
  },
  {
    id: "faq",
    label: "FAQ",
    path: "/faq",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/#contact",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
  },
];

const getNetworkPath = (network: Network): string => {
  if (network === "ropsten") {
    return "https://dev.tradetrust.io";
  } else if (network === "homestead" || network === "local") {
    return homesteadUrlPath;
  } else {
    return `https://${network}.tradetrust.io`;
  }
};

export interface NavigationBarProps {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ logout }) => {
  const { configFile } = usePersistedConfigFile();
  return (
    <nav className="bg-navy py-6">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-auto">
            <Link to="/">
              <img className="h-12" src={logo} alt="TradeTrust Logo" />
            </Link>
          </div>
          {navItems.map((item, index) => {
            return (
              <div
                className={`w-auto ml-0 pr-4 pt-4 lg:pl-8 lg:pr-0 lg:py-0 ${index === 0 ? "lg:ml-auto" : ""} ${
                  index === navItems.length ? "ml-auto" : "pr-0"
                }`}
                key={index}
              >
                {["create-documents", "settings"].includes(item.id) ? (
                  <Link
                    className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                    to={item.path}
                  >
                    {item.id === "settings" ? <Settings data-testid="settings-icon" /> : item.label}
                  </Link>
                ) : configFile ? ( // with config file, will redirect to the relevant network's url
                  <a
                    href={`${getNetworkPath(configFile.network)}${item.path}`}
                    className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                  >
                    {item.label}
                  </a>
                ) : (
                  // without config file, will default to homestead's url
                  <a
                    href={`${homesteadUrlPath}${item.path}`}
                    className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            );
          })}
          {logout && (
            <div className={`w-auto ml-0 pr-4 pt-4 lg:pl-8 lg:pr-0 lg:py-0`}>
              <div
                className="transition-colors duration-200 ease-out text-greyblue cursor-pointer border-solid border-2 border-gray-100 rounded px-2 py-1 hover:bg-white hover:text-navy"
                onClick={logout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
