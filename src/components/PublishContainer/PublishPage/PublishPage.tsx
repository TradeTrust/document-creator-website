import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { Config } from "../../../types";
import { NavigationBar } from "../../NavigationBar";
import { PublishedScreen } from "../PublishedScreen";
import { PublishingScreen } from "../PublishingScreen";

interface PublishPage {
  config: Config;
}

export const PublishPage: FunctionComponent<PublishPage> = ({ config }) => {
  const { forms, currentForm } = useFormsContext();
  const {
    publish,
    publishState,
    publishedDocuments,
    failPublishedDocuments,
    failedJobErrors,
  } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const documentsPublished = publishState === "CONFIRMED";

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  return (
    <>
      <NavigationBar />
      {documentsPublished ? (
        <PublishedScreen
          publishedDocuments={publishedDocuments}
          failPublishedDocuments={failPublishedDocuments}
          failedJobErrors={failedJobErrors}
        />
      ) : (
        <PublishingScreen forms={forms} />
      )}
    </>
  );
};
