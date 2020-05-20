import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";
import { vars } from "../../styles";

interface ProgressBarProps {
  step: number;
  className?: string;
}

export const ProgressBar: FunctionComponent<ProgressBarProps> = styled(({ className, step }) => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const description = (step: number) => {
    switch (step) {
      case 1:
        return "Upload Config";

      case 2:
        return "Choose Type";

      case 3:
        return "Fill Form";

      case 4:
        return "Issue complete";

      default:
        return "";
    }
  };

  return (
    <div className={className}>
      <div className="steps">{`Step ${step}/4: ${description(step)}`}</div>
      <div className="unfilled">
        <div className="filled" />
      </div>
    </div>
  );
})`
  .steps {
    color: ${vars.greyDark};
    font-weight: bold;
    font-size: 16px;
  }

  .unfilled {
    width: 388px;
    height: 3px;
    margin: 11px 0 24px 0;
    background-color: ${vars.greyLight};
  }

  .filled {
    height: 3px;
    width: ${(props) => (props.step / 4) * 100}%;
    background-color: ${vars.greenLight};
    transition: width 1s ${vars.easeOutCubic};
  }
`;
