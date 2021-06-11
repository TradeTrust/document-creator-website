import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { FunctionComponent } from "react";
import { Download, XCircle } from "react-feather";
import { useConfigContext } from "../../../common/context/config";
import { useFormsContext } from "../../../common/context/forms";
import { generateFileName } from "../../../utils/fileName";
import { ProgressBar } from "../../ProgressBar";
import { Title } from "../../UI/Title";
import { Wrapper } from "../../UI/Wrapper";

interface PublishErrorScreen {
  error?: Error;
}

export const PublishErrorScreen: FunctionComponent<PublishErrorScreen> = ({ error }) => {
  const { setConfig, config } = useConfigContext();
  const { setForms, setActiveFormIndex } = useFormsContext();

  const onDone = (): void => {
    setForms([]);
    setActiveFormIndex(undefined);
    setConfig(undefined);
  };

  return (
    <Wrapper>
      <ProgressBar step={3} />
      <div className="flex justify-between items-end">
        <Title className="flex items-center mb-8">
          <XCircle className="mr-2 text-red" />
          Document(s) failed to issue
        </Title>
        <Button
          className="bg-orange text-white hover:bg-orange-600 mb-6"
          data-testid="form-logout-button"
          onClick={onDone}
        >
          Logout
        </Button>
      </div>
      <div className="bg-grey-100 py-6 h-screen">
        <div className="container">
          <div className="bg-red-100 p-3 flex flex-col">
            <div className="flex">
              <XCircle className="text-red" />
              <div className="flex flex-col flex-grow">
                <div className="text-red ml-2 flex-grow">Failed to publish due to:</div>
                <div className="text-red ml-2 flex-grow">- {error?.message}</div>
                <div className="text-red ml-2 flex-grow">Kindly rectify and try publishing again.</div>
              </div>
              <Button className="bg-white text-red hover:bg-grey-100 h-12">
                <a
                  download={generateFileName({
                    network: config?.network,
                    fileName: "error-log",
                    extension: "txt",
                    hasTimestamp: true,
                  })}
                  href={`data:text/plain;charset=UTF-8,${JSON.stringify(error, null, 2)}`}
                >
                  <div className="flex">
                    <Download />
                    <div className="text-red ml-2">Download Error Log</div>
                  </div>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
