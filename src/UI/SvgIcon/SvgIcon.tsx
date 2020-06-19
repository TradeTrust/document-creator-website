import React, { FunctionComponent } from "react";

interface SvgIconProps {
  tooltipId?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

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

export const SvgIconArrowLeft: FunctionComponent = () => {
  return (
    <g className="arrow-left">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </g>
  );
};

export const SvgIconPaperClip: FunctionComponent = () => {
  return (
    <g className="paperclip">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </g>
  );
};

export const SvgIconX: FunctionComponent = () => {
  return (
    <g className="x">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </g>
  );
};
