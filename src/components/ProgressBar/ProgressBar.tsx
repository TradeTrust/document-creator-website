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
        const progressIndex = index + 1;
        const isActiveStep = progressIndex === step;
        const isSameOrBeforeActiveStep = index < step;
        return (
          <div
            style={{ width: `${100 / totalSteps}%` }}
            className={`${isSameOrBeforeActiveStep ? `bg-cerulean` : `bg-cloud-300`} h-1 mr-1 last:mr-0 relative`}
            key={`bar-${index}`}
          >
            {isActiveStep && (
              <div
                style={{ height: 24, width: 24 }}
                data-testid={`progress-bar-step-${progressIndex}`}
                className="bg-cerulean items-center flex justify-center rounded-full text-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              >
                {progressIndex}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
