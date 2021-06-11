import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { PublishState } from "../../../constants/PublishState";
import { Config } from "../../../types";
import { PublishedScreen } from "../PublishedScreen";
import { PublishErrorScreen } from "../PublishErrorScreen";

interface PublishPage {
  config: Config;
}

export const PublishPage: FunctionComponent<PublishPage> = ({ config }) => {
  const { forms, currentForm } = useFormsContext();
  const { publish, publishState, publishedDocuments, failedPublishedDocuments, pendingPublishDocuments, error } =
    usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  return publishState === PublishState.ERROR ? (
    <PublishErrorScreen error={error} />
  ) : (
    <PublishedScreen
      publishedDocuments={publishedDocuments}
      failedPublishedDocuments={failedPublishedDocuments}
      pendingPublishDocuments={pendingPublishDocuments}
      publishState={publishState}
    />
  );
};
