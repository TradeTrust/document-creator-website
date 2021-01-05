import { AddressBook, BackArrow } from "@govtechsg/tradetrust-ui-components";
import { usePersistedConfigFile } from "./../../common/hook/usePersistedConfigFile";
import { Link } from "react-router-dom";
import React, { FunctionComponent } from "react";
import { NavigationBar } from "../NavigationBar";

export const AddressBookContainer: FunctionComponent = () => {
  const { configFile } = usePersistedConfigFile();
  return (
    <>
      <NavigationBar />
      <div className="container py-8">
        <Link to="/settings">
          <BackArrow />
        </Link>
        <h3>Settings: Address Book</h3>
        <AddressBook network={configFile?.network} />
      </div>
    </>
  );
};
