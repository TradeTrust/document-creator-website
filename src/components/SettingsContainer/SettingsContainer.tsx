import { TileInfo, TileInfoProps, IconAddressBook, IconResolverAddress } from "@tradetrust-tt/tradetrust-ui-components";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";
interface SettingsOptions extends TileInfoProps {
  pathLink: string;
}

const settingsOptions: SettingsOptions[] = [
  {
    title: "Address Book",
    description: "Access and update your addresses",
    tileIcon: <IconAddressBook />,
    pathLink: "/settings/address-book",
  },
  {
    title: "Address Book Resolver",
    description: "Set up and add third party’s endpoint to resolve addresses’ identity",
    tileIcon: <IconResolverAddress />,
    pathLink: "/settings/address-resolver",
  },
];

export const SettingsContainer: FunctionComponent = () => {
  return (
    <div className="container py-8">
      <h2 data-testid="page-title">Settings</h2>
      <div className="flex flex-wrap mt-4">
        {settingsOptions.map((details, index) => (
          <div className="mr-4 mb-4" key={index}>
            <Link to={details.pathLink} className="inline-block">
              <TileInfo title={details.title} description={details.description} tileIcon={details.tileIcon} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
