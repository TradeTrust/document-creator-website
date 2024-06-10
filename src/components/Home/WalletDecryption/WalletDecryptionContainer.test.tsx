import React from "react";
import { render, waitFor } from "@testing-library/react";
import { WalletDecryptionContainer } from "./WalletDecryptionContainer";
import { useConfigContext } from "../../../common/context/config";
import { usePersistedConfigFile } from "../../../common/hook/usePersistedConfigFile";
import { DEMO_PASSWD } from "../../../constants/demo-config";
import { decryptWalletOrSigner } from "../../../common/config/decrypt";

jest.mock("../../../common/context/config");
jest.mock("../../../common/hook/usePersistedConfigFile");
jest.mock("../../../common/config/decrypt", () => ({
  decryptWalletOrSigner: jest.fn().mockResolvedValue({}),
}));

describe("WalletDecryptionContainer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should call onDecryptConfigFile with DEMO_PASSWD if isDemo is true and configFile exists", async () => {
    const setConfig = jest.fn();
    const configFile = { network: "mainnet", forms: [], documentStorage: {} };

    // Mock useConfigContext to return isDemo as true
    (useConfigContext as jest.Mock).mockReturnValue({
      setConfig,
      isDemo: true,
    });

    // Mock usePersistedConfigFile to return a configFile
    (usePersistedConfigFile as jest.Mock).mockReturnValue({
      configFile,
      setConfigFile: jest.fn(),
    });

    render(<WalletDecryptionContainer />);

    // Wait for useEffect to run
    await waitFor(() => {
      expect(decryptWalletOrSigner).toHaveBeenCalledWith(configFile, DEMO_PASSWD, expect.any(Function));
    });
  });
});
