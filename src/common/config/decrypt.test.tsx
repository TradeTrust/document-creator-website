import { ConfigFile } from "../../types";
import { decryptWalletOrSigner } from "./decrypt";

import sample from "../../test/fixtures/config/v2/sample-config-goerli.json";

const configFile = sample as ConfigFile;

describe("decryptWalletOrSigner", () => {
  it("should return wallet when decryption is successful", async () => {
    const wallet = await decryptWalletOrSigner(configFile, "password", () => {});
    expect(await wallet.getAddress()).toBe("0x1245e5B64D785b25057f7438F715f4aA5D965733");
    expect(wallet.privateKey).toBe("0x416f14debf10172f04bef09f9b774480561ee3f05ee1a6f75df3c71ec0c60666");
  });

  it("should throw when decryption fails", async () => {
    await expect(decryptWalletOrSigner(configFile, "wrongPassword", () => {})).rejects.toThrow(/invalid password/);
  });
});
