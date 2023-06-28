import { ConfigFile } from "../../types";
import { decryptWalletOrSigner } from "./decrypt";

import sample from "../../test/fixtures/config/v3/sample-config-local.json";

const configFile = sample as ConfigFile;

describe("decryptWalletOrSigner", () => {
  it("should return wallet when decryption is successful", async () => {
    const wallet = await decryptWalletOrSigner(configFile, "password", () => {});
    expect(await wallet.getAddress()).toBe("0xe0A71284EF59483795053266CB796B65E48B5124");
    expect(wallet.privateKey).toBe("0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7");
  });

  it("should throw when decryption fails", async () => {
    await expect(decryptWalletOrSigner(configFile, "wrongPassword", () => {})).rejects.toThrow(/invalid password/);
  });
});
