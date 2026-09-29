import React, { useState, useCallback, useEffect, useRef, FunctionComponent } from "react";
import {
  FrameConnector,
  HostActions,
  renderDocument,
  FrameActions,
} from "@tradetrust-tt/decentralized-renderer-react-components";
import { OpenAttestationDocument, utils } from "@tradetrust-tt/tradetrust";

type Dispatch = (action: HostActions) => void;

interface DocumentPreview {
  document: OpenAttestationDocument;
}

export const DocumentPreview: FunctionComponent<DocumentPreview> = ({ document }) => {
  const toFrame = useRef<Dispatch>();
  const lastRenderedDocument = useRef<string>();
  const [height, setHeight] = useState(0);
  const rendererUrl = utils.getTemplateURL(document);

  const sendRender = useCallback((frame: Dispatch, doc: OpenAttestationDocument) => {
    const serialized = JSON.stringify(doc);
    if (serialized === lastRenderedDocument.current) return;
    lastRenderedDocument.current = serialized;
    frame(renderDocument({ document: doc }));
  }, []);

  const onConnected = useCallback(
    (frame: Dispatch) => {
      toFrame.current = frame;
      // Reset so the connected frame always receives the latest document
      lastRenderedDocument.current = undefined;
      sendRender(frame, document);
    },
    [document, sendRender]
  );

  // Re-render when form data changes after the frame is already connected
  useEffect(() => {
    if (toFrame.current) {
      sendRender(toFrame.current, document);
    }
  }, [document, sendRender]);

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
