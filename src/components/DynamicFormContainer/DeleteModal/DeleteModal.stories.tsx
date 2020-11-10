import React, { FunctionComponent } from "react";
import { DeleteModal } from "./DeleteModal";

export default {
  title: "DynamicForm|DeleteModal",
  component: DeleteModal,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default: FunctionComponent = () => (
  <DeleteModal deleteForm={() => true} show={true} closeDeleteModal={() => false} />
);
