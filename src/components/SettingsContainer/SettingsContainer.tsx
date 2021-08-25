import { TileInfo } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";

export const SettingsContainer: FunctionComponent = () => {
  return (
    <div className="container py-8">
      <h3>Settings</h3>
      <div className="my-4">
        <Link to="/settings/address-book">
          <TileInfo tileIcon={<div />} title="Address Book" description="Access and update your addresses" />
        </Link>
        <br />
        <Link to="/settings/address-resolver">
          <TileInfo
            tileIcon={<div />}
            title="Address Book Resolver"
            description="Set up and add third party’s endpoint to resolve addresses’ identity"
          />
        </Link>
      </div>
    </div>
  );
};
