import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { Config } from "../../../types";
import { NavigationBar } from "../../NavigationBar";
import { PublishedScreen } from "../PublishedScreen";
import { PublishErrorScreen } from "../PublishErrorScreen";
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
    failedPublishedDocuments,
    error,
  } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const documentsPublished = publishState === "CONFIRMED";
  const documentsPublishing = publishState === "UNINITIALIZED" || publishState === "INITIALIZED";
  const ErrorPublishing = publishState === "ERROR";

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  return (
    <>
      <NavigationBar />
      {documentsPublished && (
        <PublishedScreen
          publishedDocuments={publishedDocuments}
          failedPublishedDocuments={failedPublishedDocuments}
        />
      )}
      {documentsPublishing && <PublishingScreen forms={forms} />}
      {ErrorPublishing && <PublishErrorScreen error={error} />}
    </>
  );
};
