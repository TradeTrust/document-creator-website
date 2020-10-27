import { decryptWallet } from "../../common/config/decrypt";
import sampleConfig from "../../test/fixtures/sample-config.json";
import { Config, ConfigFile } from "../../types";
import { generateFileName, generateErrorLogFileName } from "./fileName";

describe("generateFileName", () => {
  it("should generate the file name correctly with the given config and file name", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password", () => {});
    const config = { ...sampleConfig, wallet } as Config;
    const fileName = generateFileName(config, "document-1", "tt");

    expect(fileName).toStrictEqual("document-1-ropsten.tt");
  });

  it("should generate the file name correctly when config.network is 'homestead'", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password", () => {});
    const config = { ...sampleConfig, network: "homestead", wallet } as Config;
    const fileName = generateFileName(config, "document-1", "tt");

    expect(fileName).toStrictEqual("document-1.tt");
  });

  it("should generate the extension correctly", async () => {
    const wallet = await decryptWallet(sampleConfig as ConfigFile, "password", () => {});
    const config = { ...sampleConfig, network: "homestead", wallet } as Config;
    const extension = "txt";
    const fileName = generateFileName(config, "document-1", extension);

    expect(fileName).toStrictEqual("document-1.txt");
  });
});

describe("generateErrorLogFileName", () => {
  // beforeEach(() => {
  //   const date = new Date(1572393600000); // 2019-10-30T00:00Z0 (GMT)

  // });
  it("should generate the correct date time at the end of the error log file name", () => {
    const mockDate = new Date("Tue, 23 Jun 2020 14:34:56");
    const RealDate = Date;
    (global as any).Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    };

    expect(generateErrorLogFileName()).toStrictEqual("error-log_2020-06-23T06:34:56.000Z");

    global.Date = RealDate;
  });
});
