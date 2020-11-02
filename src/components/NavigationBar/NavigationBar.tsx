import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Settings } from "react-feather";
import logo from "./logo.svg";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";

const homesteadUrlPath = "https://tradetrust.io";

const navItems = [
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
    path: homesteadUrlPath + "/resources",
  },
  {
    id: "faq",
    label: "FAQ",
    path: homesteadUrlPath + "/faq",
  },
  {
    id: "contact",
    label: "Contact",
    path: homesteadUrlPath + "/#contact",
  },
  {
    id: "settings",
    label: "Settings",
    path: homesteadUrlPath + "/settings",
  },
];

const getVerifyPath = (network: string): string => {
  if (network === "ropsten") {
    return "https://dev.tradetrust.io";
  } else if (network === "homestead") {
    return homesteadUrlPath;
  } else {
    return `https://${network}.tradetrust.io`;
  }
};

interface NavigationBar {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBar> = ({ logout }) => {
  const { configFile } = usePersistedConfigFile();
  return (
    <div className="bg-navy py-6">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between">
          <div className="w-full lg:w-auto">
            <Link to="/">
              <img className="h-12" src={logo} alt="TradeTrust Logo" />
            </Link>
          </div>
          {navItems.map((item, index) => {
            return (
              <div
                className={`w-auto ml-0 pr-4 pt-4 lg:pl-8 lg:pr-0 lg:py-0 ${
                  index === 0 ? "lg:ml-auto" : ""
                } ${index === navItems.length ? "ml-auto" : "pr-0"}`}
                key={index}
              >
                {item.id === "create-documents" ? (
                  <Link
                    className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                    to={item.path}
                  >
                    {item.label}
                  </Link>
                ) : item.id === "verify-documents" ? (
                  configFile ? ( // with config file, will redirect to network's verify page
                    <a
                      href={`${getVerifyPath(configFile.network)}${item.path}`}
                      className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                    >
                      {item.label}
                    </a>
                  ) : (
                    // without config file, will default to homestead's verify page
                    <a
                      href={`${homesteadUrlPath}${item.path}`}
                      className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                    >
                      {item.label}
                    </a>
                  )
                ) : (
                  <a
                    href={item.path}
                    className="transition-colors duration-200 ease-out text-greyblue hover:text-white"
                  >
                    {item.id === "settings" ? <Settings data-testid="settings-icon" /> : item.label}
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
    </div>
  );
};
