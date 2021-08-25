import React, { FunctionComponent } from "react";
import { Settings } from "react-feather";
import {
  Button,
  NavigationBar as NavBar,
  NavigationItem,
  NAVIGATION_ITEM_TYPE,
  ButtonSize,
} from "@govtechsg/tradetrust-ui-components";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { URLS } from "../../constants/Urls";

const NavLogo = () => {
  return (
    <NavLink to={"/"} data-testid="nav-logo-home">
      <h4 className="text-gray-800">TradeTrust</h4>
    </NavLink>
  );
};

export const NavigationBar: FunctionComponent<{
  logout?: (() => void) | undefined;
}> = ({ logout }) => {
  const [toggleNavBar, setToggleNavBar] = useState(false);

  const isLoggedIn = Boolean(logout);

  const tradeTrustUrl = isLoggedIn ? URLS.DEV : URLS.MAIN;

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
          path: `${tradeTrustUrl}/learn`,
          customLink: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${tradeTrustUrl}/learn`}
              className="block w-full px-4 py-3 hover:text-cerulean"
            >
              Learn
            </a>
          ),
        },
        {
          id: "faq",
          label: "FAQ",
          path: `${tradeTrustUrl}/faq`,
          customLink: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${tradeTrustUrl}/faq`}
              className="block w-full px-4 py-3 hover:text-cerulean"
            >
              FAQ
            </a>
          ),
        },
        {
          id: "eta",
          label: "ETA",
          path: `${tradeTrustUrl}/eta`,
          customLink: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${tradeTrustUrl}/eta`}
              className="block w-full px-4 py-3 hover:text-cerulean"
            >
              ETA
            </a>
          ),
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
          path: `${tradeTrustUrl}/news`,
          customLink: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${tradeTrustUrl}/news`}
              className="block w-full px-4 py-3 hover:text-cerulean"
            >
              News
            </a>
          ),
        },
        {
          id: "event",
          label: "Event",
          path: `${tradeTrustUrl}/event`,
          customLink: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${tradeTrustUrl}/event`}
              className="block w-full px-4 py-3 hover:text-cerulean"
            >
              Event
            </a>
          ),
        },
      ],
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLink,
      id: "contact",
      label: "Contact",
      path: `${tradeTrustUrl}/contact`,
      customLink: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`${tradeTrustUrl}/contact`}
          className="block w-full px-4 py-3 hover:text-cerulean"
        >
          Contact
        </a>
      ),
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
        <NavLink activeClassName="text-cerulean" className="block w-full py-2 text-current" to={"/settings"}>
          <Settings className="stroke-current" />
        </NavLink>
      ),
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "create-documents",
      label: "Create Doc",
      path: "/",
      customLink: (
        <a href={"/"}>
          <Button className="bg-white text-cerulean hover:bg-gray-50" size={ButtonSize.SM}>
            Create Doc
          </Button>
        </a>
      ),
    },
    {
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "verify",
      label: "Verify Doc",
      path: `${tradeTrustUrl}/verify`,
      customLink: (
        <a target="_blank" rel="noopener noreferrer" href={`${tradeTrustUrl}/verify`}>
          <Button className="bg-cerulean text-white hover:bg-cerulean-500" size={ButtonSize.SM}>
            Verify Doc
          </Button>
        </a>
      ),
    },
  ];

  if (isLoggedIn) {
    rightNavItems.push({
      schema: NAVIGATION_ITEM_TYPE.NavigationLabelButton,
      id: "log-out",
      label: "Logout",
      path: "/",
      customLink: (
        <a onClick={logout} href={"/"}>
          <Button className="bg-white text-cerulean hover:bg-gray-50" size={ButtonSize.SM}>
            Logout
          </Button>
        </a>
      ),
    });
  }

  return (
    <div className="sm: py-1">
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
