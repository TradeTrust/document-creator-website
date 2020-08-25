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

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  const switchScreen = (): JSX.Element => {
    switch (publishState) {
      case "CONFIRMED":
        return (
          <PublishedScreen
            publishedDocuments={publishedDocuments}
            failedPublishedDocuments={failedPublishedDocuments}
          />
        );
      case "ERROR":
        return <PublishErrorScreen error={error} />;

      default:
        return <PublishingScreen forms={forms} />;
    }
  };
  return (
    <>
      <NavigationBar />
      {switchScreen()}
    </>
  );
};
