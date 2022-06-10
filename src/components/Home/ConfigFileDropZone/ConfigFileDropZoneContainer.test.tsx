import React, { render, screen } from "@testing-library/react";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZoneContainer";

describe("ConfigFileDropZoneContainer", () => {
  it("documentation link for config-file should be correct and open in new tab", () => {
    render(<ConfigFileDropZoneContainer />);
    const docLink = screen.getByTestId("no-config-file-button");
    expect(docLink.getAttribute("target")).toBe("_blank");
    expect(docLink.getAttribute("href")).toBe(
      "https://docs.tradetrust.io/docs/document-creator/config-file/config-generator"
    );
  });
});
