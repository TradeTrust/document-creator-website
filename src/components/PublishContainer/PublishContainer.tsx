import prettyBytes from "pretty-bytes";
import React, { FunctionComponent, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { useFormsContext } from "../../common/context/forms";
import { usePublishQueue } from "../../common/hook/usePublishQueue";
import { Config } from "../../types";
import { Button } from "../../UI/Button";
import { PublishLoader } from "../../UI/PublishLoader";
import { SvgIcon, SvgIconCheckCircle } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";
import { ProgressBar } from "../ProgressBar";

interface PublishPage {
  config: Config;
}

export const PublishPage: FunctionComponent<PublishPage> = ({ config }) => {
  const { setConfig } = useConfigContext();
  const { forms, currentForm, setForms, setActiveFormIndex } = useFormsContext();
  const { publish, publishState, wrappedDocuments } = usePublishQueue(config, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const documentsPublished = publishState === "CONFIRMED";
  // const documentsPublished = true;

  const createAnotherDoc = (): void => {
    const nextForms = [...forms];
    nextForms.splice(nextForms.length - 1, 1);
    setForms(nextForms);
    setActiveFormIndex(undefined);
  };

  const iAmDone = (): void => {
    setConfig(undefined);
  };

  const getFileSize = (jsonString: string): number => {
    const m = encodeURIComponent(jsonString).match(/%[89ABab]/g);
    return jsonString.length + (m ? m.length : 0);
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
                <Button className="bg-orange text-white self-end py-3 px-4 mb-6" onClick={iAmDone}>
                  I am Done
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white-dark p-6 h-screen">
            <div className="container mx-auto">
              <div className="border-b border-solid border-lightgrey">
                <div className="text-grey font-medium text-lg mb-4">{forms.length} Documents</div>
              </div>

              <div className="flex flex-wrap">
                {wrappedDocuments.map((doc, index) => {
                  const size = prettyBytes(getFileSize(JSON.stringify(doc.wrappedDocument)));
                  return (
                    <div
                      key={index}
                      className="mt-4 flex rounded bg-white p-3 w-72 border border-solid border-lightgrey mr-4"
                    >
                      <div className="rounded-full bg-blue mr-4 w-12 h-12 text-white font-bold flex justify-center items-center">
                        TT
                      </div>
                      <div className="flex flex-col">
                        <div className="font-bold text-lightgrey-dark">
                          {doc.fileName}
                          <span className="text-lightgrey-dark text-xs font-regular">
                            {" "}
                            ({size})
                          </span>
                        </div>
                        <a
                          className="text-blue font-bold"
                          href={`data:text/json;charset=utf-8,${JSON.stringify(
                            doc.wrappedDocument
                          )}`}
                          download={doc.fileName}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          <Wrapper>
            <div className="container mx-auto h-auto flex justify-center flex-col items-center mt-32">
              <div className="text-grey-dark font-bold text-lg">
                Please wait while we are publishing the document(s).
              </div>
              <div className="text-grey-dark font-medium text-lg flex flex-col justify-center items-center text-xl mt-24">
                <PublishLoader />
                Publishing <span className="text-blue font-bold">{forms.length}</span> document(s)
              </div>
            </div>
          </Wrapper>
        </Container>
      )}
    </>
  );
};

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  if (!config) return <Redirect to="/" />;
  return <PublishPage config={config} />;
};
