import React, { FunctionComponent } from "react";
import { Container } from "../../Container";
import { ProgressBar } from "../../ProgressBar";
import { Button } from "../../UI/Button";
import { SvgIcon, SvgIconXCircle } from "../../UI/SvgIcon";
import { Title } from "../../UI/Title";

interface PublishingError {
  onCreateAnother: () => void;
  onLogout: () => void;
  errorMessage?: string;
}

export const PublishingError: FunctionComponent<PublishingError> = ({
  errorMessage,
  onCreateAnother,
  onLogout,
}) => {
  return (
    <Container>
      <div className="container mx-auto pt-8">
        <ProgressBar step={3} />
        <div className="flex justify-between items-end">
          <Title className="flex items-center">
            <SvgIcon className="mr-2 text-red">
              <SvgIconXCircle />
            </SvgIcon>
            An Error Has Occurred
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
            <div className="text-grey font-medium text-lg mb-4">Message: {errorMessage}</div>
            <div className="text-grey font-medium text-lg mb-4">
              You may want to check the application log to see the errors in detail.
            </div>
            <div className="text-grey font-medium text-lg mb-4">
              To enable logging on the console, run `localStorage.debug ="*"`.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};
