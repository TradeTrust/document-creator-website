import { v2CoverLetter } from "./forms/v2";
import { v3Invoice } from "./forms/v3";
import tmp from "tmp";
import { Credential, EmptyConfig, Forms } from "./types";
import { generateConfigFile } from "./generator";
import { readFileSync } from "fs";

const localCredential: Credential = {
  network: "local",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"e0a71284ef59483795053266cb796b65e48b5124","id":"04c746c3-fbef-453a-8c63-5e915021f57a","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"0f6963939595d04cb27a4d4abe689e32"},"ciphertext":"c80c8ca9acb96cf2f87279fef71508a06d4cf166e46e06a8beecd1420f2f525f","kdf":"scrypt","kdfparams":{"salt":"bf52c3386a9235e74a075c533ec1febd6e9221b57d649a2e156775fce984a58e","n":1,"dklen":32,"p":1,"r":8},"mac":"5014d1d53e9294028eb808fbc9dd36394ebec22381946724111b9ee5ab46fd06"}}',
  },
  tokenRegistry: "0x9Eb613a88534E2939518f4ffBFE65F5969b491FF",
  documentStore: "0x63a223e025256790e88778a01f480eba77731d04",
  identityProof: "demo-tradetrust.openattestation.com",
};

const configFile: EmptyConfig = {
  network: "",
  wallet: "",
  forms: [],
};

describe("generateConfigFile", () => {
  it("generate V2 configuration file correctly", () => {
    const v2TestForm: Forms[] = [{ version: "v2", forms: [v2CoverLetter] }];
    const tempConfigFile = tmp.fileSync({ postfix: ".json" });
    generateConfigFile({
      configFile: configFile,
      formsList: v2TestForm,
      credential: localCredential,
      directory: tempConfigFile.name,
      validationBypass: false,
    });
    const fileContent = readFileSync(tempConfigFile.name, "utf8");
    expect(fileContent).toMatch(/"TradeTrust Covering Letter v2"/);
    expect(fileContent).toMatch(/"demo-tradetrust.openattestation.com"/);
    expect(fileContent).toMatch(/"0x63a223e025256790e88778a01f480eba77731d04"/);
  });

  it("generate V3 configuration file correctly", () => {
    const v3TestForm: Forms[] = [{ version: "v3", forms: [v3Invoice] }];
    const tempConfigFile = tmp.fileSync({ postfix: ".json" });
    generateConfigFile({
      configFile: configFile,
      formsList: v3TestForm,
      credential: localCredential,
      directory: tempConfigFile.name,
      validationBypass: false,
    });
    const fileContent = readFileSync(tempConfigFile.name, "utf8");

    expect(fileContent).toMatch(/"TradeTrust Invoice v3"/);
    expect(fileContent).toMatch(
      /"https:\/\/schemata.openattestation.com\/io\/tradetrust\/Invoice\/1.0\/invoice-context.json"/
    );
    expect(fileContent).toMatch(/"demo-tradetrust.openattestation.com"/);
    expect(fileContent).toMatch(/"0x63a223e025256790e88778a01f480eba77731d04"/);
  });
});
