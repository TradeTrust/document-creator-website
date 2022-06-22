import React, { FunctionComponent } from "react";
import { MemoryRouter } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

export default {
  title: "Common/NavigationBar",
  component: NavigationBar,
  parameters: {
    componentSubtitle: "NavigationBar.",
  },
};

export const Default: FunctionComponent = () => (
  <MemoryRouter>
    <div className="border border-solid border-cloud-300">
      <NavigationBar />
    </div>
  </MemoryRouter>
);

export const WithLogout: FunctionComponent = () => (
  <MemoryRouter>
    <div className="border border-solid border-cloud-300">
      <NavigationBar
        logout={() => {
          alert("logging out");
        }}
      />
    </div>
  </MemoryRouter>
);
