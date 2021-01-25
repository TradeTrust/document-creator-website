import { ConfigFile } from "../../types";
import { decryptWallet, getGsnRelaySigner } from "./decrypt";
import sample from "../../test/fixtures/sample-config-ropsten.json";

const configFile = sample as ConfigFile;

describe("decryptWallet", () => {
  it("should return wallet when decryption is successful", async () => {
    const wallet = await decryptWallet(configFile, "password", () => {});
    expect(wallet.address).toBe("0x1245e5B64D785b25057f7438F715f4aA5D965733");
    expect(wallet.privateKey).toBe(
      "0x416f14debf10172f04bef09f9b774480561ee3f05ee1a6f75df3c71ec0c60666"
    );
  });

  it("should throw when decryption fails", async () => {
    await expect(decryptWallet(configFile, "wrongPassword", () => {})).rejects.toThrow(
      /invalid password/
    );
  });
});

describe("getGsnRelayProvider", () => {
  it("should return gsn provider", async () => {
    const wallet = await decryptWallet(configFile, "password", () => {});
    const gsnProvider = await getGsnRelaySigner(
      wallet,
      "0xf30f39F18efD6680c27A7A84c3c27B76E91116b9"
    );
    expect(gsnProvider).toHaveProperty("_address", "0x1245e5B64D785b25057f7438F715f4aA5D965733");
    expect(gsnProvider).toHaveProperty("provider.provider.relayClient.config.chainId", 3);
    expect(gsnProvider).toHaveProperty(
      "provider.provider.relayClient.config.forwarderAddress",
      "0x25CEd1955423BA34332Ec1B60154967750a0297D"
    );
    expect(gsnProvider).toHaveProperty(
      "provider.provider.relayClient.config.paymasterAddress",
      "0xf30f39F18efD6680c27A7A84c3c27B76E91116b9"
    );
    expect(gsnProvider).toHaveProperty(
      "provider.provider.relayClient.config.relayHubAddress",
      "0x29e41C2b329fF4921d8AC654CEc909a0B575df20"
    );
  });
});
