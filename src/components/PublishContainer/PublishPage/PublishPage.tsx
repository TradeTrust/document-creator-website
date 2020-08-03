import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { Config } from "../../../types";
import { NavigationBar } from "../../NavigationBar";
import { PublishingSuccess } from "../PublishingSuccess";
import { PublishingPending } from "../PublishingPending";
import { PublishingError } from "../PublishingError";
interface PublishPage {
  config: Config;
}

export const PublishPage: FunctionComponent<PublishPage> = ({ config }) => {
  const { setConfig } = useConfigContext();
  const { forms, currentForm, setForms, setActiveFormIndex } = useFormsContext();
  const {
    publish,
    publishState,
    publishedDocuments,
    failPublishedDocuments,
    error,
  } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const createAnotherDoc = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
  };

  const onDone = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  if (!config) return <Redirect to="/" />;
  if (!currentForm) return <Redirect to="/forms-selection" />;

  switch (publishState) {
    case "CONFIRMED":
      return (
        <>
          <NavigationBar />
          <PublishingPending forms={forms} />
        </>
      );
    case "PENDING_CONFIRMATION":
      return (
        <>
          <NavigationBar />
          <PublishingSuccess
            failPublishedDocuments={failPublishedDocuments}
            publishedDocuments={publishedDocuments}
            noDocuments={forms.length}
            onCreateAnother={createAnotherDoc}
            onLogout={onDone}
          />
        </>
      );
    default:
      return (
        <>
          <NavigationBar />
          <PublishingError
            onCreateAnother={createAnotherDoc}
            onLogout={onDone}
            errorMessage={error}
          />
        </>
      );
  }
};
