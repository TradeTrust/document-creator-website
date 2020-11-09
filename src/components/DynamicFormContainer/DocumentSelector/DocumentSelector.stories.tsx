import React from "react";
import { DocumentSelector } from "./DocumentSelector";

export default {
  title: "DynamicForm|DocumentSelector",
  component: DocumentSelector,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <DocumentSelector validateCurrentForm={() => true} closePreviewMode={() => true} />
);
