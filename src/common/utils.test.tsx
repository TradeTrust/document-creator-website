import { decodeQrCode, encodeQrCode, getDocumentNetwork, validateData } from "./utils";

describe("encodeQrCode", () => {
  it("should encode the url into the correct format", () => {
    const qrCode = {
      type: "url",
      payload: {
        uri: "https://testurl.com",
        key: "123",
        permittedActions: ["STORE"],
        redirect: "test Site",
      },
    };

    expect(encodeQrCode(qrCode)).toStrictEqual(
      "https://actions.tradetrust.io?q=%7B%22type%22%3A%22url%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftesturl.com%22%2C%22key%22%3A%22123%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22test%20Site%22%7D%7D"
    );
  });
});

describe("decodeQrCode with oa action", () => {
  it("decodes an action correctly regardless of trailing slash", () => {
    const encodedQrCodeSlash =
      "https://action.openattestation.com/?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    const encodedQrCodeNoSlash =
      "https://action.openattestation.com?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";

    expect(decodeQrCode(encodedQrCodeSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
    expect(decodeQrCode(encodedQrCodeNoSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
  });

  it("throws when qr code is malformed", () => {
    const encodedQrCode = "http://%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    expect(() => decodeQrCode(encodedQrCode)).toThrow("not formatted");
  });
});

describe("decodeQrCode with tt action", () => {
  it("decodes an action correctly regardless of trailing slash", () => {
    const encodedQrCodeSlash =
      "https://actions.tradetrust.io/?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";
    const encodedQrCodeNoSlash =
      "https://actions.tradetrust.io?q=%7B%22uri%22%3A%22https%3A%2F%2Fsample.domain%2Fdocument%2Fid%3Fq%3Dabc%23123%22%7D";

    expect(decodeQrCode(encodedQrCodeSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
    expect(decodeQrCode(encodedQrCodeNoSlash)).toStrictEqual({
      uri: "https://sample.domain/document/id?q=abc#123",
    });
  });
});

describe("getDocumentNetwork", () => {
  it("should get the network details based on the network given", () => {
    expect(getDocumentNetwork("sepolia")).toStrictEqual({ network: { chain: "ETH", chainId: "11155111" } });
  });

  it("should throw an error when the network is not in the list", () => {
    // @ts-expect-error: Test if the error will throw when its not one of the type in the Network enum.
    expect(() => getDocumentNetwork("abc")).toThrow("Unsupported network abc");
  });
});

describe("validateData", () => {
  const schema = {
    type: "object",
    additionalProperties: false,
    properties: {
      logo: {
        type: "string",
        title: "Document Title",
      },
      title: {
        type: "string",
        title: "Document Title",
      },
      remarks: {
        type: "string",
        title: "Remarks",
      },
      backgroundColor: {
        type: "string",
        title: "Background Color",
      },
      titleColor: {
        type: "string",
        title: "Title Color",
      },
      remarksColor: {
        type: "string",
        title: "Remarks Color",
      },
    },
  };

  it("should validate correctly when all data is provided", async () => {
    const { isValid } = await validateData(schema, {
      logo: "",
      title: "Some title 123",
      remarks: "",
      backgroundColor: "",
      titleColor: "",
      remarksColor: "",
    });
    expect(isValid).toBe(true);
  });

  it("should not validate if additional field is provided", async () => {
    const { isValid } = await validateData(schema, { foo: "" });
    expect(isValid).toBe(false);
  });
});
