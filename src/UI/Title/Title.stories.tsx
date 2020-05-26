import React from "react";
import { Title } from "./Title";

export default {
  title: "Title|Title",
  component: Title,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => <Title>This is the title</Title>;
