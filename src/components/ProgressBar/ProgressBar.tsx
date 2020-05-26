import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";

interface ProgressBarProps {
  step: number;
  className?: string;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = styled(({ className, step }) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const description = (step: number) => {
    switch (step) {
      case 1:
        return "Choose Type";

      case 2:
        return "Fill Form";

      case 3:
        return "Issue complete";

      default:
        return "";
    }
  };

  return (
    <div className={className}>
      <div className="text-grey-dark font-bold text-base">
        {`Step ${step}/3: ${description(step)}`}
      </div>
      <div className="w-full max-w-sm h-1 bg-grey-lighter mt-3 mb-6">
        <div className="h-1 w-full bg-green-lighter transition duration-1000 ease-out progressBar" />
      </div>
    </div>
  );
})`
  .progressBar {
    width: ${(props) => (props.step / 3) * 100}%;
  }
`;
