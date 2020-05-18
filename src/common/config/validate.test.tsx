/* eslint-disable  @typescript-eslint/no-explicit-any */
import sample from "./sample.json";
import { assertConfigFile } from "./validate";

describe("configFileSchema", () => {
  it("validates against sample wallet file", () => {
    expect.assertions(1);
    expect(() => assertConfigFile(sample)).not.toThrow();
  });

  it("throws when wallet is malformed", () => {
    expect.assertions(2);
    expect(() => assertConfigFile({ ...sample, wallet: undefined } as any)).toThrow(/missing/);
    expect(() => assertConfigFile({ ...sample, wallet: "" } as any)).toThrow(/not allowed to be empty/);
  });
});
