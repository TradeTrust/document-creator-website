import { AddressResolver } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { NavigationBar } from "../NavigationBar";
import { Wrapper } from "../UI/Wrapper";

export const AddressResolverContainer: FunctionComponent = () => {
  return (
    <>
      <NavigationBar />
      <Wrapper>
        <AddressResolver />
      </Wrapper>
    </>
  );
};
