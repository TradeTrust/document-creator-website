import { fireEvent, render, screen } from "@testing-library/react";
import { saveAs } from "file-saver";
import { useConfigContext } from "../../../common/context/config";
import { QueueType } from "../../../constants/QueueState";
import { WrappedDocument } from "../../../types";
import { ProcessedDocumentTag } from "./ProcessedDocumentTag";

import sampleConfig from "../../../test/fixtures/config/v3/sample-config-local.json";

jest.mock("file-saver");
jest.mock("../../../common/context/config");

const mockSaveAs = saveAs as unknown as jest.Mock;
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
  extension: "tt",
} as WrappedDocument;

describe("processedDocumentTag", () => {
  it("should render correctly with the given doc", () => {
    withConfigFile();
    render(<ProcessedDocumentTag doc={mockDoc} isPending={false} type={QueueType.ISSUE} />);

    expect(screen.getAllByText("test-local.tt")).toHaveLength(1);
    expect(screen.getAllByText("(24 B)")).toHaveLength(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should generate the 'href' accordingly for download", () => {
    mockSaveAs;
    withConfigFile();
    render(<ProcessedDocumentTag doc={mockDoc} isPending={false} type={QueueType.ISSUE} />);

    expect(screen.getAllByText("Download")).toHaveLength(1);
    fireEvent.click(screen.getByTestId("download-file-button"));
    expect(mockSaveAs).toHaveBeenCalledTimes(1);
    expect(screen.queryAllByTestId("publish-loader")).toHaveLength(0);
  });

  it("should display the loader when isPending is true", () => {
    withConfigFile();
    render(<ProcessedDocumentTag doc={mockDoc} isPending={true} type={QueueType.ISSUE} />);

    expect(screen.queryAllByTestId("processing-loader")).toHaveLength(1);
  });
});
