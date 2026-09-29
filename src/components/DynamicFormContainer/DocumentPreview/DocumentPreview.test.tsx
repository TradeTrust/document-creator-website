import { act, render, screen } from "@testing-library/react";
import React from "react";
import { DocumentPreview } from "./DocumentPreview";

const mockDispatch = jest.fn();
let capturedOnConnected: ((frame: typeof mockDispatch) => void) | undefined;

jest.mock("@tradetrust-tt/decentralized-renderer-react-components", () => {
  const actual = jest.requireActual("@tradetrust-tt/decentralized-renderer-react-components");
  return {
    ...actual,
    FrameConnector: ({
      onConnected,
      source,
    }: {
      onConnected: (frame: typeof mockDispatch) => void;
      source: string;
    }) => {
      capturedOnConnected = onConnected;
      return <iframe title="Decentralised Rendered Certificate" id="iframe" src={source} />;
    },
  };
});

const sampleDocument = {
  $template: {
    name: "CHAFTA_COO",
    type: "EMBEDDED_RENDERER",
    url: "https://generic-templates.tradetrust.io",
  },
  iD: "wfa.org.au:coo:WBC208897",
  issuers: [{ name: "Demo Issuer", documentStore: "0x0", identityProof: { type: "DNS-TXT", location: "example.com" } }],
};

describe("DocumentPreview", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    capturedOnConnected = undefined;
  });

  it("dispatches renderDocument with the uploaded document when the frame connects", () => {
    render(<DocumentPreview document={sampleDocument as never} />);

    expect(screen.getByTestId("document-preview").getAttribute("data-document-id")).toBe(sampleDocument.iD);
    expect(screen.getByTestId("document-preview").getAttribute("data-renderer-url")).toBe(sampleDocument.$template.url);
    expect(screen.getByTitle("Decentralised Rendered Certificate").getAttribute("src")).toBe(
      sampleDocument.$template.url
    );

    act(() => {
      capturedOnConnected?.(mockDispatch);
    });

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe("RENDER_DOCUMENT");
    expect(action.payload.document).toMatchObject({ iD: sampleDocument.iD });
  });
});
