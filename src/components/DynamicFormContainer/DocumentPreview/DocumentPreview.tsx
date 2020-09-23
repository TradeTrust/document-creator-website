import React, { useState, useCallback, useRef, FunctionComponent, useEffect } from "react";
import {
  FrameConnector,
  HostActions,
  renderDocument,
  FrameActions,
  Document,
} from "@govtechsg/decentralized-renderer-react-components";

type Dispatch = (action: HostActions) => void;

interface DocumentPreview {
  document: Document;
}

export const DocumentPreview: FunctionComponent<DocumentPreview> = ({ document }) => {
  const toFrame = useRef<Dispatch>();
  const [height, setHeight] = useState(0);

  // Update document preview every time when the user navigates through the different documents
  useEffect(() => {
    if (toFrame.current) {
      toFrame.current(renderDocument({ document }));
    }
  }, [document]);

  const rendererUrl = document["$template"]?.url;
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
