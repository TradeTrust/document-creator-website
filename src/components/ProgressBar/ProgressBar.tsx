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
      <BarFill className="h-1 w-full bg-cerulean transition duration-1000 ease-out" progress={progress} />
    </div>
  );
};

export const ProgressBar: FunctionComponent<ProgressBarProps> = ({ className, step, totalSteps, title }) => {
  return (
    <div className={`max-w-sm ${className}`}>
      <div className="text-gray-800 font-bold text-base" data-testid={"progress-bar"}>
        {`Step ${step}/${totalSteps}: ${title}`}
      </div>
      <div className="mt-3 mb-6">
        <BarTrack progress={step / totalSteps} />
      </div>
    </div>
  );
};
