import React, { FunctionComponent } from "react";

interface SvgIconProps {
  tooltipId?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const SvgIconArrowLeft: FunctionComponent = () => {
  return (
    <g className="arrow-left">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </g>
  );
};

export const SvgIcon: FunctionComponent<SvgIconProps> = ({ tooltipId, children, ...props }) => {
  const tooltipProps = tooltipId
    ? {
        "data-tip": "",
        "data-for": `tooltip-${tooltipId}`,
      }
    : null;

  return (
    <svg
      {...tooltipProps}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
};
