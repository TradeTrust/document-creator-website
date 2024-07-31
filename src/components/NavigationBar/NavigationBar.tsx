import { FunctionComponent, useState } from "react";
import { Settings } from "react-feather";
import { NavLink } from "react-router-dom";
import {
  Button,
  ButtonSize,
  NavigationBar as NavBar,
  NavigationItem,
  NAVIGATION_ITEM_TYPE,
} from "@tradetrust-tt/tradetrust-ui-components";
import { LogoutButton } from "./LogoutButton";
import { URLS } from "../../constants/Urls";

export interface NavigationBarProps {
  logout?: () => void;
}

export const NavigationBar: FunctionComponent<NavigationBarProps> = ({ logout }) => {
  const [toggleNavBar, setToggleNavBar] = useState(false);

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
            className="bg-white text-cerulean-500 hover:bg-cloud-100"
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
        <a href={"https://ref.tradetrust.io"} data-testid="navbar-verify-doc">
          <Button className="bg-cerulean-500 text-white hover:bg-cerulean-800" size={ButtonSize.SM}>
            Verify Doc
          </Button>
        </a>
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
      <a href={`${URLS.INFO}`} data-testid="nav-logo-home">
        <img src="/tradetrust_logo.svg" />
      </a>
    );
  };

  return (
    <NavBar
      logo={<NavLogo />}
      menuLeft={[]}
      menuRight={rightNavItems}
      menuMobile={[]}
      setToggleNavBar={setToggleNavBar}
      toggleNavBar={toggleNavBar}
    />
  );
};
