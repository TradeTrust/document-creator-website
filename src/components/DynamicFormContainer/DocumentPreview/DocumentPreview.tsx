import React, { useState, useCallback, useRef, FunctionComponent } from "react";
import {
  FrameConnector,
  HostActions,
  renderDocument,
  FrameActions,
} from "@govtechsg/decentralized-renderer-react-components";
import { v2 } from "@govtechsg/open-attestation";

type Dispatch = (action: HostActions) => void;

interface DocumentPreview {
  document: v2.OpenAttestationDocument;
}

export const DocumentPreview: FunctionComponent<DocumentPreview> = ({ document }) => {
  const toFrame = useRef<Dispatch>();
  const [height, setHeight] = useState(0);

  const rendererTemplate = document["$template"] as v2.TemplateObject;
  const rendererUrl = rendererTemplate?.url;
  const onConnected = useCallback(
    (frame) => {
      toFrame.current = frame;
      if (toFrame.current) {
        toFrame.current(renderDocument({ document }));
      }
    },
    [document]
  );
  const handleDispatch = (action: FrameActions): void => {
    if (action.type === "UPDATE_HEIGHT") {
      setHeight(action.payload);
    }
    if (action.type === "OBFUSCATE") {
      alert("Privacy filter not available in preview mode");
    }
  };

  return rendererUrl ? (
    <FrameConnector
      source={rendererUrl}
      dispatch={handleDispatch}
      onConnected={onConnected}
      style={{ height }}
      className="block m-auto w-full"
    />
  ) : null;
};
