import { v2 } from "@govtechsg/open-attestation";
import React, { FunctionComponent } from "react";
import SampleCnm from "../../../test/fixtures/unwrapped-cnm.json";
import { DocumentPreview } from "./DocumentPreview";

export default {
  title: "DynamicForm/DocumentPreview",
  component: DocumentPreview,
  parameters: {
    componentSubtitle: "DocumentPreview.",
  },
};

export const TitleAndMessage: FunctionComponent = () => (
  <DocumentPreview document={SampleCnm as v2.OpenAttestationDocument} />
);
