import styled from "@emotion/styled";
import React, { FunctionComponent } from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  title: string;
  className?: string;
}
interface BarTrackProps {
  className?: string;
  progress: number;
}

const BarFill = styled.div`
  width: ${(props: BarTrackProps) => props.progress * 100}%;
`;

export const BarTrack: FunctionComponent<BarTrackProps> = ({ className, progress }) => {
  return (
    <div className={`w-full h-1 bg-gray-300 ${className}`}>
      <BarFill className="h-1 w-full bg-cerulean-500 transition duration-1000 ease-out" progress={progress} />
    </div>
  );
};

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({ step, totalSteps }) => {
  const bars = [...Array(totalSteps).keys()];

  return (
    <div data-testid="progress-bar" className="flex py-4">
      {bars.map((_, index) => {
        const isActiveStep = index + 1 === step;
        const isSameOrBeforeActiveStep = index < step;
        const isFinalStep = index === totalSteps - 1;
        return (
          <div
            style={{ width: `${100 / totalSteps}%` }}
            className={`${isSameOrBeforeActiveStep ? `bg-cerulean` : `bg-cloud-300`} h-1${
              isFinalStep ? "" : ` mr-1`
            } relative`}
            key={`bar-${index}`}
          >
            {isActiveStep && (
              <div
                data-testid={`progress-bar-step-${index + 1}`}
                className="bg-cerulean text-center rounded-full text-white absolute left-1/2"
                style={{
                  width: 24,
                  height: 24,
                  top: -10,
                }}
              >
                {index + 1}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
