import React, { render, screen } from "@testing-library/react";
import { ConfigFileDropZoneContainer } from "./ConfigFileDropZoneContainer";

describe("ConfigFileDropZoneContainer", () => {
  it("documentation link for config-file should be correct and open in new tab", () => {
    render(<ConfigFileDropZoneContainer />);
    const docLink = screen.getByText("Don’t have a config file? Learn how to create one");
    expect(docLink.getAttribute("target")).toBe("_blank");
    expect(docLink.getAttribute("href")).toBe("https://docs.tradetrust.io/docs/document-creator/config-file");
  });
});
