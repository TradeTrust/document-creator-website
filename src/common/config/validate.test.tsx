/* eslint-disable  @typescript-eslint/no-explicit-any */
import sample from "./sample.json";
import { assertConfigFile } from "./validate";

describe("configFileSchema", () => {
  it("validates against sample wallet file", () => {
    expect.assertions(1);
    expect(() => assertConfigFile(sample as any)).not.toThrow();
  });

  it("throws when wallet is malformed", () => {
    expect.assertions(6);
    expect(() => assertConfigFile({ ...sample, wallet: undefined } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, wallet: "" } as any)).toThrow(
      /not allowed to be empty/
    );
    expect(() => assertConfigFile({ ...sample, forms: undefined } as any)).toThrow(/missing/);
    expect(() =>
      assertConfigFile({ ...sample, forms: [{ name: undefined, type: "abc" }] } as any)
    ).toThrow(/missing/);
    expect(() =>
      assertConfigFile({ ...sample, forms: [{ name: "abc", type: undefined }] } as any)
    ).toThrow(/missing/);
    expect(() =>
      assertConfigFile({ ...sample, forms: [{ name: "abc", type: "abc" }] } as any)
    ).toThrow(/must be one of/);
  });
});
