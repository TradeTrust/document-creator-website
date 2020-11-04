import React, { FunctionComponent } from "react";
import { AddressResolver } from "@govtechsg/tradetrust-ui-components";
import { NavigationBar } from "../NavigationBar";

export const AddressResolverContainer: FunctionComponent = () => {
  return (
    <>
      <NavigationBar />
      <AddressResolver />
    </>
  );
};
