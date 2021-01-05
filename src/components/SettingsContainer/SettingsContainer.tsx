import { TileInfo } from "@govtechsg/tradetrust-ui-components";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";
import { NavigationBar } from "../NavigationBar";

export const SettingsContainer: FunctionComponent = () => {
  return (
    <>
      <NavigationBar />
      <div className="container py-8">
        <h3>Settings</h3>
        <div className="my-4">
          <Link to="/settings/address-book">
            <TileInfo title="Address Book" description="Access and update your addresses" />
          </Link>
          <br />
          <Link to="/settings/address-resolver">
            <TileInfo
              title="Address Book Resolver"
              description="Set up and add third party’s endpoint to resolve addresses’ identity"
            />
          </Link>
        </div>
      </div>
    </>
  );
};
