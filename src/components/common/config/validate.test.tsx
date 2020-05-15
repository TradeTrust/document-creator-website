import { assertConfigFile } from "./validate";
import sample from "./sample.json";
import { Wallet } from "ethers";

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

it("works", async () => {
  const wallet = Wallet.createRandom();
  const enc = await wallet.encrypt("password");
  console.log(JSON.stringify(enc));
});
