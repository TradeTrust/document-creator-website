/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { render, screen, fireEvent, act, wait } from "@testing-library/react";
import React from "react";
import { ConfigFileDropZone } from "./ConfigFileDropZone";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createFileTransferEvent = (files: File[]) => {
  return {
    dataTransfer: {
      files,
      items: files.map((file: File) => ({
        kind: "file",
        size: file.size,
        type: file.type,
        getAsFile: () => file,
      })),
      types: ["Files"],
    },
  };
};

describe("configFileDropZone", () => {
  it("should have the right text", () => {
    render(<ConfigFileDropZone onConfigFile={() => {}} />);
    expect(screen.queryByText(/Upload Configuration File/)).not.toBeNull();
    expect(screen.queryByText(/drop file here/)).not.toBeNull();
  });

  it("should allow onConfigFile to be called with dropped JSON file", async () => {
    const onConfigFile = jest.fn();
    render(<ConfigFileDropZone onConfigFile={onConfigFile} />);

    const configContent = { foo: "bar" };
    const file = new File([JSON.stringify(configContent)], "ping.json", { type: "text/plain" });
    const data = createFileTransferEvent([file]);

    await act(async () => {
      const event = new Event("drop", { bubbles: true });
      Object.assign(event, data);
      fireEvent(screen.getByTestId("config-file-drop-zone"), event);
      await wait(() => expect(onConfigFile).toHaveBeenCalledWith(configContent));
    });
  });
});
