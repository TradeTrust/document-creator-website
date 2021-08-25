import React from "react";

interface FrameProps {
  children: React.ReactNode;
}

export const Frame: React.FunctionComponent<FrameProps> = ({ children }: FrameProps) => {
  return (
    <div className="flex space-x-56">
      <div className="flex-1">{children}</div>
      <div className="flex-none hidden lg:block">
        <img src={"/static/creator-graphic.png"} />
      </div>
    </div>
  );
};
