/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ConfigFileDropZone } from "./ConfigFileDropZone";
import { createFileTransferEvent } from "../../../utils/utils";
import { useConfigContext } from "../../../common/context/config";
import { DEMO_CONFIG_BETA } from "../../../constants/demo-config";
jest.mock("../../../common/context/config");

describe("configFileDropZone", () => {
  beforeEach(() => {
    const setIsDemo = jest.fn();
    const useConfigContextMock = useConfigContext as jest.Mock;
    useConfigContextMock.mockResolvedValue({ setIsDemo });
  });
  it("should have the right text", () => {
    render(<ConfigFileDropZone onConfigFile={() => {}} />);
    expect(screen.queryByText(/Create and Revoke Document/)).not.toBeNull();
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
      fireEvent(screen.getByTestId("config-file-dropzone"), event);
      await waitFor(() => expect(onConfigFile).toHaveBeenCalledWith(configContent));
    });
  });

  it("should call onConfigFile method with DEMO_CONFIG_BETA and load config file button is clicked", async () => {
    const setIsDemo = jest.fn();
    const onConfigFile = jest.fn().mockResolvedValue(true);
    const useConfigContextMock = useConfigContext as jest.Mock;
    useConfigContextMock.mockResolvedValue({ setIsDemo });
    // Mock the context to return the setIsDemo function
    (useConfigContext as jest.Mock).mockReturnValue({
      setIsDemo,
    });

    render(<ConfigFileDropZone onConfigFile={onConfigFile} errorMessage="" />);

    // Find the load-demo-config-button
    const loadDemoConfigButton = screen.getByTestId("load-demo-config-button");

    // Click the load-demo-config-button
    fireEvent.click(loadDemoConfigButton);

    expect(setIsDemo).toHaveBeenCalledWith(true);
    expect(onConfigFile).toHaveBeenCalledWith(DEMO_CONFIG_BETA);
  });
});
