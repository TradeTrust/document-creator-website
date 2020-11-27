import React, { FunctionComponent } from "react";
import { PublishLoader } from "./PublishLoader";

export default {
  title: "UI/PublishLoader",
  component: PublishLoader,
  parameters: {
    componentSubtitle: "PublishLoader.",
  },
};

export const Default: FunctionComponent = () => {
  return (
    <div className="h-12 w-12">
      <PublishLoader />
    </div>
  );
};
