import { generateFileName } from "./utils";

describe("generateFileName", () => {
  it("should generate the file name correctly with the given config and file name", async () => {
    const fileName = generateFileName({
      network: "ropsten",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1-ropsten.tt");
  });

  it("should generate the file name correctly when config.network is 'homestead'", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1.tt");
  });

  it("should generate the extension correctly", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "txt",
    });

    expect(fileName).toStrictEqual("document-1.txt");
  });
});

describe("generateErrorLogFileName", () => {
  it("should generate the correct date time at the end of the error log file name", () => {
    const mockDate = new Date(1572393600000);
    const RealDate = Date;
    (global as any).Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    };

    const fileName = generateFileName({
      network: "ropsten",
      fileName: "error-log",
      extension: "tt",
      hasTimestamp: true,
    });

    expect(fileName).toStrictEqual("error-log-ropsten-2019-10-30T00:00:00.000Z.tt");

    global.Date = RealDate;
  });
});
