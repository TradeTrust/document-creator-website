import React from "react";
import { NavigationBar } from "./NavigationBar";

export default {
  title: "NavigationBar",
  component: NavigationBar,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const NavigationBarStory = () => (
  <div>
    <h1 className="storybook-title">NavigationBar</h1>
    <NavigationBar />
  </div>
);
