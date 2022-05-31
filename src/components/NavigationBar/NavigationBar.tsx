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
import { LogoutButton } from "./LogoutButton";

export interface NavigationBarProps {
  logout?: () => void;
}

interface NavBarLink {
  path: string;
  label: string | ReactElement;
  testid: string;
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ logout }) => {
  const { configFile } = usePersistedConfigFile();

  const networkPath = getNetworkPath(configFile?.network);

  const DropDownLink: FunctionComponent<NavBarLink> = ({ path, label, testid }) => {
    return (
      <a data-testid={testid} className="block w-full px-4 py-3 text-cloud-500" href={`${networkPath}${path}`}>
        {label}
      </a>
    );
  };

  const NavBarLink: FunctionComponent<NavBarLink> = ({ path, label, testid }) => {
    return (
      <a data-testid={testid} className="block w-full text-cloud-500" href={`${networkPath}${path}`}>
        {label}
      </a>
    );
  };

  const [toggleNavBar, setToggleNavBar] = useState(false);

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
          customLink: <DropDownLink path={"/learn"} label={"Learn"} testid={"navbar-learn"} />,
        },
        {
          id: "faq",
          label: "FAQ",
          path: "/faq",
          customLink: <DropDownLink path={"/faq"} label={"FAQ"} testid={"navbar-faq"} />,
        },
        {
          id: "eta",
          label: "ETA",
          path: "/eta",
          customLink: <DropDownLink path={"/eta"} label={"ETA"} testid={"navbar-eta"} />,
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
          customLink: <DropDownLink path={"/news"} label={"News"} testid={"navbar-news"} />,
        },
        {
          id: "event",
          label: "Event",
          path: "/event",
          customLink: <DropDownLink path={"/event"} label={"Event"} testid={"navbar-event"} />,
        },
      ],
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLink,
      id: "contact",
      label: "Contact",
      path: "/contact",
      customLink: <NavBarLink path={"/contact"} label="Contact" testid="navbar-contact" />,
    },
  ];

  const rightNavItems: NavigationItem[] = [
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationIconButton,
      id: "settings",
      label: "Settings",
      path: "/settings",
      icon: Settings,
      customLink: (
        <NavLink to={"/settings"} data-testid="navbar-settings">
          <Settings data-testid="settings-icon" className="stroke-current text-cloud-500 hover:text-cerulean-500" />
        </NavLink>
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
            className="bg-white text-cerulean-500 hover:bg-gray-50"
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
      customLink: (
        <NavBarLink
          path={"/verify"}
          label={
            <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800" size={ButtonSize.SM}>
              Verify Doc
            </Button>
          }
          testid="navbar-verify-doc"
        />
      ),
    },
  ];

  if (logout) {
    rightNavItems.push({
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "logout",
      label: "Logout",
      path: "/",
      customLink: <LogoutButton logout={logout} />,
    });
  }

  const NavLogo = () => {
    return (
      <NavLink to={"/"} data-testid="nav-logo-home">
        <img src="/tradetrust_logo.svg" />
      </NavLink>
    );
  };

  return (
    <NavBar
      logo={<NavLogo />}
      menuLeft={leftNavItems}
      menuRight={rightNavItems}
      menuMobile={leftNavItems.concat(rightNavItems)}
      setToggleNavBar={setToggleNavBar}
      toggleNavBar={toggleNavBar}
    />
  );
};
