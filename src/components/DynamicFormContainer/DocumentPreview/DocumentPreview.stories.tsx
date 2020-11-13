import React, { FunctionComponent } from "react";
import { Container } from "../../Container";
import { DocumentPreview } from "./DocumentPreview";
import SampleCnm from "../../../test/fixtures/unwrapped-cnm.json";
import { v2 } from "@govtechsg/open-attestation";

export default {
  title: "|DynamicForm|DocumentPreview",
  component: DocumentPreview,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const TitleAndMessage: FunctionComponent = () => (
  <Container>
    <DocumentPreview document={SampleCnm as v2.OpenAttestationDocument} />
  </Container>
);
