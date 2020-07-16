import { encodeQrCode } from "./utils";

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
      "https://action.openattestation.com/?q=%7B%22type%22%3A%22url%22%2C%22payload%22%3A%7B%22uri%22%3A%22https%3A%2F%2Ftesturl.com%22%2C%22key%22%3A%22123%22%2C%22permittedActions%22%3A%5B%22STORE%22%5D%2C%22redirect%22%3A%22test%20Site%22%7D%7D"
    );
  });
});
