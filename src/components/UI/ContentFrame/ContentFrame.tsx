import React from "react";

interface ContentFrameProps {
  children: React.ReactNode;
}

export const ContentFrame: React.FunctionComponent<ContentFrameProps> = ({ children }: ContentFrameProps) => {
  return (
    <div className="flex justify-between">
      <div className="flex-1">{children}</div>
      <div className="hidden lg:block ml-8">
        <img src={"/creator-graphic.png"} />
      </div>
    </div>
  );
};
