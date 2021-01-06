import { AddressResolver, BackArrow } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";

export const AddressResolverContainer: FunctionComponent = () => {
  return (
    <>
      <div className="container py-8">
        <Link to="/settings">
          <BackArrow />
        </Link>
        <AddressResolver />
      </div>
    </>
  );
};
