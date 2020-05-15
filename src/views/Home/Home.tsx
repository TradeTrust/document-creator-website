import React from "react";
import { InitializeConfig } from "../../components/InitializeConfig";
import { NavigationBar } from "../../components/NavigationBar";

export const Home: React.FunctionComponent = () => (
  <div>
    <NavigationBar />
    <InitializeConfig />
  </div>
);
