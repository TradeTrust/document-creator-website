import { AddressBook, BackArrow } from "@govtechsg/tradetrust-ui-components";
import { usePersistedConfigFile } from "./../../common/hook/usePersistedConfigFile";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";

export const AddressBookContainer: FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  return (
    <div className="container py-8">
      <Link to="/settings">
        <BackArrow />
      </Link>
      <div className="flex-1 flex-col">
        <h2 className="font-ubuntu text-4xl text-cloud-900">Address Book</h2>
        <p className="mb-5 text-cloud-900">Please select an address book to view. </p>
      </div>
      <AddressBook network={configFile?.network} />
    </div>
  );
};
