import React from "react";

interface ContentFrameProps {
  children: React.ReactNode;
}

export const ContentFrame: React.FunctionComponent<ContentFrameProps> = ({ children }: ContentFrameProps) => {
  return (
    <div className="flex space-x-56">
      <div className="flex-1">{children}</div>
      <div className="flex-none hidden lg:block">
        <img src={"/creator-graphic.png"} />
      </div>
    </div>
  );
};
