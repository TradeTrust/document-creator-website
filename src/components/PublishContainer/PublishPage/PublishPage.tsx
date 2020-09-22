import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { PUBLISH_STATE } from "../../../constants";
import { Config } from "../../../types";
import { NavigationBar } from "../../NavigationBar";
import { PublishedScreen } from "../PublishedScreen";
import { PublishErrorScreen } from "../PublishErrorScreen";

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
    pendingPublishDocuments,
    error,
  } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  const switchScreen = (): JSX.Element => {
    switch (publishState) {
      case PUBLISH_STATE.ERROR:
        return <PublishErrorScreen error={error} />;

      default:
        return (
          <PublishedScreen
            publishedDocuments={publishedDocuments}
            failedPublishedDocuments={failedPublishedDocuments}
            pendingPublishDocuments={pendingPublishDocuments}
            publishState={publishState}
          />
        );
    }
  };
  return (
    <>
      <NavigationBar />
      {switchScreen()}
    </>
  );
};
