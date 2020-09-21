import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";

interface ProgressBarProps {
  step: number;
  className?: string;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = styled(({ className, step }) => {
  const description = ["Choose Type", "Fill Form", "Issue Document(s)"];

  return (
    <div className={className}>
      <div className="text-grey-dark font-bold text-base" data-testid={"progress-bar"}>
        {`Step ${step}/3: ${description[step - 1]}`}
      </div>
      <div className="w-full max-w-sm h-1 bg-grey-lighter mt-3 mb-6">
        <div className="h-1 w-full bg-teal transition duration-1000 ease-out progressBar" />
      </div>
    </div>
  );
})`
  .progressBar {
    width: ${(props) => (props.step / 3) * 100}%;
  }
`;
