/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { act, fireEvent, render, screen, wait } from "@testing-library/react";
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
    expect(screen.queryByText(/Create Document/)).not.toBeNull();
    expect(screen.queryByText(/Drag and drop your configuration file here/)).not.toBeNull();
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
