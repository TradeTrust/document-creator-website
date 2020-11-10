import React, { FunctionComponent } from "react";
import { MemoryRouter } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

export default {
  title: "NavigationBar",
  component: NavigationBar,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => (
  <MemoryRouter>
    <NavigationBar />
  </MemoryRouter>
);

export const WithLogout: FunctionComponent = () => (
  <MemoryRouter>
    <NavigationBar
      logout={() => {
        alert("logging out");
      }}
    />
  </MemoryRouter>
);
