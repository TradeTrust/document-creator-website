import { AddressResolver, BackArrow } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";

export const AddressResolverContainer: FunctionComponent = () => {
  return (
    <div className="container py-8">
      <Link to="/settings">
        <BackArrow />
      </Link>
      <div className="flex-1 flex-col">
        <h2 className="font-ubuntu text-4xl text-cloud-800">Resolver: Address</h2>
        <p className="mb-5 text-cloud-800">Add third party’s endpoint to resolve addresses.</p>
      </div>
      <AddressResolver />
    </div>
  );
};
