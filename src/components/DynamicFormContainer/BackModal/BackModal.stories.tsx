import React from "react";
import { BackModal } from "./BackModal";

export default {
  title: "DynamicForm|BackModal",
  component: BackModal,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => (
  <BackModal backToFormSelection={() => true} show={true} closeBackModal={() => false} />
);
