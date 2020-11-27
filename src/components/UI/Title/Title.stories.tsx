import React, { FunctionComponent } from "react";
import { Title } from "./Title";

export default {
  title: "UI/Title",
  component: Title,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => <Title>This is the title</Title>;
