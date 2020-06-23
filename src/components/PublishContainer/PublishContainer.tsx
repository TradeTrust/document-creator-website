import React, { FunctionComponent, useEffect } from "react";
import { useConfigContext } from "../../common/context/config";
import { Container } from "../Container";
import { NavigationBar } from "../NavigationBar";
import { useFormsContext } from "../../common/context/forms";
import { usePublishQueue } from "../../common/hook/usePublishQueue";

export const PublishContainer: FunctionComponent = () => {
  const { config } = useConfigContext();
  const { forms } = useFormsContext();
  const { publish, publishState, wrappedDocuments } = usePublishQueue(config!, forms);

  useEffect(() => {
    publish();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <NavigationBar />
      <Container>
        <h1>Publishing {forms.length} Documents!</h1>
        <h1>State: {publishState}</h1>
        <small>{JSON.stringify(forms, null, 2)}</small>
        {wrappedDocuments.map((doc, index) => {
          return (
            <div key={index}>
              <a
                href={`data:text/json;charset=utf-8,${JSON.stringify(doc.wrappedDocument)}`}
                download={doc.fileName}
              >
                Download {doc.fileName}
              </a>
            </div>
          );
        })}
      </Container>
    </>
  );
};
