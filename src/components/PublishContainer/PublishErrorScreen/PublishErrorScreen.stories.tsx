import React, { FunctionComponent } from "react";
import { PublishErrorScreen } from "./PublishErrorScreen";

export default {
  title: "PublishPage/PublishErrorScreen",
  component: PublishErrorScreen,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => {
  const error = new Error("some Error");
  return <PublishErrorScreen error={error} />;
};
