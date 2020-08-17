import React from "react";
import { Container } from "../../Container";
import { DocumentPreview } from "./DocumentPreview";
import SampleCnm from "../../../test/fixtures/unwrapped-cnm.json";
import { Document } from "@govtechsg/decentralized-renderer-react-components";

export default {
  title: "|DynamicForm|DocumentPreview",
  component: DocumentPreview,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const TitleAndMessage = () => (
  <Container>
    <DocumentPreview document={SampleCnm as Document} />
  </Container>
);
