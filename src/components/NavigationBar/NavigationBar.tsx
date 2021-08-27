import { FunctionComponent, ReactElement, useState } from "react";
import { Settings } from "react-feather";
import { NavLink } from "react-router-dom";
import { usePersistedConfigFile } from "../../common/hook/usePersistedConfigFile";
import {
  Button,
  ButtonSize,
  NavigationBar as NavBar,
  NavigationItem,
  NAVIGATION_ITEM_TYPE,
} from "@govtechsg/tradetrust-ui-components";
import { getNetworkPath } from "../../utils";

export interface NavigationBarProps {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ logout }) => {
  const { configFile } = usePersistedConfigFile();

  const networkPath = getNetworkPath(configFile?.network);

  const [toggleNavBar, setToggleNavBar] = useState(false);

  const renderDropDownLink = (path: string, label: string | ReactElement, testid: string) => {
    return (
      <a data-testid={testid} className="block w-full px-4 py-3" href={`${networkPath}${path}`}>
        {label}
      </a>
    );
  };

  const renderLink = (path: string, label: string | ReactElement, testid: string) => {
    return (
      <a data-testid={testid} className="block w-full" href={`${networkPath}${path}`}>
        {label}
      </a>
    );
  };

  const leftNavItems: NavigationItem[] = [
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
      id: "resources",
      label: "Resources",
      path: "",
      dropdownItems: [
        {
          id: "learn",
          label: "Learn",
          path: "/learn",
          customLink: renderDropDownLink("/learn", "Learn", "navbar-learn"),
        },
        {
          id: "faq",
          label: "FAQ",
          path: "/faq",
          customLink: renderDropDownLink("/faq", "FAQ", "navbar-faq"),
        },
        {
          id: "eta",
          label: "ETA",
          path: "/eta",
          customLink: renderDropDownLink("/eta", "ETA", "navbar-eta"),
        },
      ],
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationDropDownList,
      id: "news-events",
      label: "News & Events",
      path: "",
      dropdownItems: [
        {
          id: "news",
          label: "News",
          path: "/news",
          customLink: renderDropDownLink("/news", "News", "navbar-news"),
        },
        {
          id: "event",
          label: "Event",
          path: "/event",
          customLink: renderDropDownLink("/event", "Event", "navbar-event"),
        },
      ],
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLink,
      id: "contact",
      label: "Contact",
      path: "/contact",
      customLink: renderLink("/contact", "Contact", "navbar-contact"),
    },
  ];

  const rightNavItems: NavigationItem[] = [
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationIconButton,
      id: "settings",
      label: "Settings",
      path: "/settings",
      icon: Settings,
      customLink: renderLink(
        "/settings",
        <Settings data-testid="settings-icon" className="stroke-current" />,
        "navbar-settings"
      ),
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "create-documents",
      label: "Create Doc",
      path: "/",
      customLink: (
        <NavLink to={"/"}>
          <Button
            data-testid="navbar-create-doc"
            className="bg-white text-cerulean hover:bg-gray-50"
            size={ButtonSize.SM}
          >
            Create Doc
          </Button>
        </NavLink>
      ),
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "verify",
      label: "Verify Doc",
      path: "/verify",
      customLink: renderLink(
        "/verify",
        <Button className="bg-cerulean text-white hover:bg-cerulean-500" size={ButtonSize.SM}>
          Verify Doc
        </Button>,
        "navbar-verify-doc"
      ),
    },
  ];

  if (logout) {
    rightNavItems.push({
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "logout",
      label: "Logout",
      path: "/",
      customLink: (
        <Button
          data-testid="navbar-logout"
          onClick={logout}
          className="bg-white text-cerulean hover:bg-gray-50"
          size={ButtonSize.SM}
        >
          Logout
        </Button>
      ),
    });
  }

  const NavLogo = () => {
    return (
      <NavLink to={"/"} data-testid="nav-logo-home">
        <h4 className="text-gray-800">TradeTrust</h4>
      </NavLink>
    );
  };

  return (
    <div>
      <NavBar
        logo={<NavLogo />}
        menuLeft={leftNavItems}
        menuRight={rightNavItems}
        menuMobile={leftNavItems.concat(rightNavItems)}
        setToggleNavBar={setToggleNavBar}
        toggleNavBar={toggleNavBar}
      />
    </div>
  );
};
