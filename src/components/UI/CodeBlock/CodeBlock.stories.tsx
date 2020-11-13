import React, { FunctionComponent } from "react";
import { CodeBlock } from "./CodeBlock";

export default {
  title: "UI/CodeBlock",
  component: CodeBlock,
  parameters: {
    componentSubtitle: "CodeBlock to show Error stack if application crashes.",
  },
};

export const Default: FunctionComponent = () => <CodeBlock code="Error Trace Stack!" />;
