import { decryptWallet } from "../../common/config/decrypt";
import sampleConfig from "../../test/fixtures/sample-config.json";
import { Config, ConfigFile } from "../../types";
import { generateFileName } from "./fileName";

describe("generateFileName", () => {
  it("should generate the file name correctly with the given config and file name", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password");
    const config = { ...sampleConfig, wallet } as Config;
    const fileName = generateFileName(config, "document-1", "tt");

    expect(fileName).toStrictEqual("document-1-ropsten.tt");
  });

  it("should generate the file name correctly when config.network is 'homestead'", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password");
    const config = { ...sampleConfig, network: "homestead", wallet } as Config;
    const fileName = generateFileName(config, "document-1", "tt");

    expect(fileName).toStrictEqual("document-1.tt");
  });

  it("should generate the extention correctly", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password");
    const config = { ...sampleConfig, network: "homestead", wallet } as Config;
    const extension = "txt";
    const fileName = generateFileName(config, "document-1", extension);

    expect(fileName).toStrictEqual("document-1.txt");
  });
});
