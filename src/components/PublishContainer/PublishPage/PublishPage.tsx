import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { usePublishQueue } from "../../../common/hook/usePublishQueue";
import { Config } from "../../../types";
import { Container } from "../../Container";
import { NavigationBar } from "../../NavigationBar";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconCheckCircle } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { PublishedTag } from "../PublishedTag";
import { Publishing } from "../Publishing";

interface PublishPage {
  config: Config;
}

export const PublishPage: FunctionComponent<PublishPage> = ({ config }) => {
  const { setConfig } = useConfigContext();
  const { forms, currentForm, setForms, setActiveFormIndex } = useFormsContext();
  const { publish, publishState, publishedDocuments } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const documentsPublished = publishState === "CONFIRMED";

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

  return (
    <>
      <NavigationBar />
      {documentsPublished ? (
        <Container>
          <div className="container mx-auto pt-8">
            <ProgressBar step={3} />
            <div className="flex justify-between items-end">
              <Title className="flex items-center">
                <SvgIcon className="mr-2 text-teal">
                  <SvgIconCheckCircle />
                </SvgIcon>
                Document(s) issued successfully
              </Title>
              <div>
                <Button className="bg-white text-orange px-4 py-3 mb-6" onClick={createAnotherDoc}>
                  Create another Document
                </Button>
                <Button className="bg-orange text-white self-end py-3 px-4 mb-6" onClick={onDone}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-lightgrey-lighter p-6 h-screen">
            <div className="container mx-auto">
              <div className="border-b border-solid border-lightgrey">
                <div className="text-grey font-medium text-lg mb-4">{forms.length} Documents</div>
              </div>

              <div className="flex flex-wrap">
                {publishedDocuments &&
                  publishedDocuments.map((doc, index) => <PublishedTag doc={doc} key={index} />)}
              </div>
            </div>
          </div>
        </Container>
      ) : (
        <Publishing forms={forms} />
      )}
    </>
  );
};
