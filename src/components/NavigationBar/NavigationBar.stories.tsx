import React from "react";
import { MemoryRouter } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

export default {
  title: "NavigationBar",
  component: NavigationBar,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <MemoryRouter>
    <NavigationBar />
  </MemoryRouter>
);

export const WithLogout = () => (
  <MemoryRouter>
    <NavigationBar
      logout={() => {
        alert("logging out");
      }}
    />
  </MemoryRouter>
);
