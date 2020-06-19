import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { CustomFileWidget } from "./CustomFileWidget";

describe("customFileWidget", () => {
  it("should render with the props", () => {
    render(
      <CustomFileWidget
        onChange={() => {}}
        value={[]}
        multiple={true}
        options={{ accept: ".pdf" }}
        disabled={false}
      />
    );

    expect(screen.getByText("Drag and drop file here")).not.toBeNull();
    expect(screen.getByText("or")).not.toBeNull();
    expect(screen.getByText("Browse File")).not.toBeNull();
    expect(screen.queryByTestId(/upload-file-/)).toBeNull();
  });

  it("should render the uploaded file when a file is uploaded", () => {
    render(
      <CustomFileWidget
        onChange={() => {}}
        value={"data:application/json;name=ebl-unwrapped.json;base64,ewq="}
        multiple={true}
        options={{ accept: ".pdf, .json" }}
        disabled={false}
      />
    );

    expect(screen.queryByTestId(/upload-file-/)).not.toBeNull();
  });

  it("should remove the file when 'X' is clicked", async () => {
    render(
      <CustomFileWidget
        onChange={() => {}}
        value={"data:application/json;name=ebl-unwrapped.json;base64,ewq="}
        multiple={true}
        options={{ accept: ".pdf, .json" }}
        disabled={false}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId("remove-uploaded-file-0"));
    });

    expect(screen.queryByTestId(/upload-file-/)).toBeNull();
  });
});
