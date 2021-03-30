import React from "react";
import sampleConfig from "../../../../src/test/fixtures/sample-config-ropsten.json";
import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";
import { saveAs } from "file-saver";
import { DataSchemaButton } from "./DataSchemaButton";

jest.mock("file-saver");
jest.mock("../../../common/context/config");
const mockSaveAs = saveAs as jest.Mock;

describe("dataFileButton", () => {
  it("should render correctly", () => {
    render(
      <DataSchemaButton formSchema={sampleConfig.forms[0].schema} isTransferableRecord={false} />
    );
    expect(screen.getByTestId("data-csv-download-button")).toHaveTextContent(
      "Download .CSV Data Schema"
    );
    expect(screen.getByTestId("data-json-download-button")).toHaveTextContent(
      "Download .JSON Data Schema"
    );
  });

  it("should generate 2 file accordingly the button click", async () => {
    mockSaveAs;
    render(
      <DataSchemaButton formSchema={sampleConfig.forms[0].schema} isTransferableRecord={false} />
    );
    expect(screen.getAllByText("Download .CSV Data Schema")).toHaveLength(1);

    await act(async () => {
      fireEvent.click(screen.getByTestId("data-csv-download-button"));
      fireEvent.click(screen.getByTestId("data-json-download-button"));
      await waitFor(() => expect(expect(mockSaveAs).toHaveBeenCalledTimes(2)));
    });
  });
});
