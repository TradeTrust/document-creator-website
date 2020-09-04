import { fireEvent, render, screen } from "@testing-library/react";
import { saveAs } from "file-saver";
import React from "react";
import { useConfigContext } from "../../../../common/context/config";
import sampleConfig from "../../../../test/fixtures/sample-config.json";
import { WrappedDocument } from "../../../../types";
import { PublishedTag } from "./PublishedTag";

jest.mock("file-saver");
jest.mock("../../../../common/context/config");

const mockSaveAs = saveAs as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;

const withConfigFile = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
};

const mockDoc = {
  type: "VERIFIABLE_DOCUMENT",
  contractAddress: "",
  fileName: "test",
  payload: {},
  rawDocument: {},
  wrappedDocument: { data: "test document" },
} as WrappedDocument;

describe("publishedTag", () => {
  it("should render correctly with the given doc", () => {
    withConfigFile();
    render(<PublishedTag doc={mockDoc} />);

    expect(screen.getAllByText("test-ropsten.tt")).toHaveLength(1);
    expect(screen.getAllByText("(24 B)")).toHaveLength(1);
  });

  it("should generate the 'href' accordingly for download", () => {
    mockSaveAs;
    withConfigFile();
    render(<PublishedTag doc={mockDoc} />);

    expect(screen.getAllByText("Download")).toHaveLength(1);
    fireEvent.click(screen.getByTestId("download-file-button"));
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
  });
});
