import React from "react";
import { PublishLoader } from "./PublishLoader";

export default {
  title: "UI|Publish Loader",
  component: PublishLoader,
  paremeters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => {
  return (
    <div className="h-12 w-12">
      <PublishLoader />
    </div>
  );
};
