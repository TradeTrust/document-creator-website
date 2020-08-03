import React, { FunctionComponent } from "react";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconCheckCircle } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";
import { PublishedTag } from "../PublishedTag";
import { WrappedDocument } from "../../../types";

interface PublishingSuccess {
  onCreateAnother: () => void;
  onLogout: () => void;
  noDocuments: number;
  publishedDocuments?: WrappedDocument[];
  failPublishedDocuments?: WrappedDocument[];
}

export const PublishingSuccess: FunctionComponent<PublishingSuccess> = ({
  onCreateAnother,
  onLogout,
  noDocuments,
  publishedDocuments,
}) => {
  return (
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
            <Button className="bg-white text-orange px-4 py-3 mb-6" onClick={onCreateAnother}>
              Create another Document
            </Button>
            <Button className="bg-orange text-white self-end py-3 px-4 mb-6" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-lightgrey-lighter p-6 h-screen">
        <div className="container mx-auto">
          <div className="border-b border-solid border-lightgrey">
            <div className="text-grey font-medium text-lg mb-4">{noDocuments} Documents</div>
          </div>

          <div className="flex flex-wrap">
            {publishedDocuments &&
              publishedDocuments.map((doc, index) => <PublishedTag doc={doc} key={index} />)}
          </div>
        </div>
      </div>
    </Container>
  );
};
