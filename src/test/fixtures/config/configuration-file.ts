import { join } from "path";
import { v2CooChafta, v2BillOfLading, v2CoverLetter, v2Invoice } from "./forms/v2";
import { v3BillOfLading, v3CooChafta, v3Invoice } from "./forms/v3";
import { CoverLetterExtension, CoverLetterNoUiSchema } from "./forms/local";
import { generateConfigFile } from "./generator";
import { v2 } from "@govtechsg/open-attestation";
import { EmptyConfig, Forms, Credential, DidCredential } from "./types";

/**
 *  Configuration file schema
 */

const configFile: EmptyConfig = {
  network: "",
  wallet: {},
  forms: [],
};

/**
 *  Credentials
 */

const ropstenCredential: Credential = {
  network: "ropsten",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  tokenRegistry: "0x72d9a82203Ef9177239A5E3cB7A8FB9a78D04f17",
  documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
  identityProof: "demo-tradetrust.openattestation.com",
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-ropsten.tradetrust.io/storage",
  },
};

const ropstenAWSCredential: Credential = {
  network: "ropsten",
  wallet: {
    type: "AWS_KMS",
    accessKeyId: "<access key id>",
    region: "<region>",
    kmsKeyId: "<kms key id>",
  },
  tokenRegistry: "",
  documentStore: "",
  identityProof: "",
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-ropsten.tradetrust.io/storage",
  },
};

const rinkebyCredential: Credential = {
  network: "rinkeby",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  tokenRegistry: "0x26E730520949F9B2F73b53A35044680c2165725D",
  documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
  identityProof: "demo-tradetrust.openattestation.com",
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-rinkeby.tradetrust.io/storage",
  },
};

const didCredential: DidCredential = {
  network: "homestead",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  didAddress: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
  identityProof: "demo-tradetrust.openattestation.com",
  revocation: {
    type: v2.RevocationType.None,
  },
};

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

/**
 *  Forms Import
 */

const documentFormsV2Local = [CoverLetterExtension, CoverLetterNoUiSchema];
const documentFormsV2 = [v2BillOfLading, v2CooChafta, v2CoverLetter, v2Invoice];
const documentFormsV3 = [v3BillOfLading, v3CooChafta, v3Invoice];

const formsV2: Forms[] = [{ version: "v2", forms: documentFormsV2 }];
const formsV3: Forms[] = [{ version: "v3", forms: documentFormsV3 }];
const didFormsV2: Forms[] = [{ version: "v2-did", forms: documentFormsV2 }];
const didFormsV3: Forms[] = [{ version: "v3-did", forms: documentFormsV3 }];
const allForms: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v3", forms: documentFormsV3 },
];

/**
 *  Generate Configuration Files
 */

// ALL Ropsten Configuration File
const ALL_FORMS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFile,
  formsList: allForms,
  credential: ropstenCredential,
  directory: ALL_FORMS_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

// V2 Ropsten Configuration File
const V2_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFile,
  formsList: formsV2,
  credential: ropstenCredential,
  directory: V2_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

// V2 AWS Ropsten Configuration File
const V2_AWS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten-aws.json");
generateConfigFile({
  configFile: configFile,
  formsList: formsV2,
  credential: ropstenAWSCredential,
  directory: V2_AWS_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

// V2 Rinkeby Configuration File
const V2_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-rinkeby.json");
generateConfigFile({
  configFile: configFile,
  formsList: formsV2,
  credential: rinkebyCredential,
  directory: V2_RINKEBY_DIRECTORY,
  validationBypass: false,
});

// V2 DNS-DID Configuration File
const V2_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-did.json");
generateConfigFile({
  configFile: configFile,
  formsList: didFormsV2,
  credential: didCredential,
  directory: V2_DID_DIRECTORY,
  validationBypass: false,
});

// V3 Ropsten Configuration File
const V3_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFile,
  formsList: formsV3,
  credential: ropstenCredential,
  directory: V3_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

// V3 Rinkeby Configuration File
const V3_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-rinkeby.json");
generateConfigFile({
  configFile: configFile,
  formsList: formsV3,
  credential: rinkebyCredential,
  directory: V3_RINKEBY_DIRECTORY,
  validationBypass: false,
});

// V3 DNS-DID Configuration File
const V3_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-did.json");
generateConfigFile({
  configFile: configFile,
  formsList: didFormsV3,
  credential: didCredential,
  directory: V3_DID_DIRECTORY,
  validationBypass: false,
});

// Generate local config for testing

// Working local document form v2
const localForms: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v2", forms: documentFormsV2Local },
  { version: "v3", forms: documentFormsV3 },
];
const LOCAL_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "sample-config-local.json");
generateConfigFile({
  configFile: configFile,
  formsList: localForms,
  credential: localCredential,
  directory: LOCAL_TEST_DIRECTORY,
  validationBypass: false,
});

// Local configuration file issuer error
const ISSUER_ERROR_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "config-invalid-issuer.json");
const identityProofErrorCredential = {
  ...localCredential,
  identityProof: "ErrorIdentityProof",
  documentStorage: {
    apiKey: "randonKey",
    url: "https://api-ropsten.tradetrust.io/storage",
  },
};
generateConfigFile({
  configFile: configFile,
  formsList: localForms,
  credential: identityProofErrorCredential,
  directory: ISSUER_ERROR_TEST_DIRECTORY,
  validationBypass: false,
});

// Local configuration empty wallet
const EMPTY_WALLET_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "config-empty-wallet.json");
const emptyWalletCredential = {
  ...localCredential,
  wallet: "",
};
generateConfigFile({
  configFile: configFile,
  formsList: localForms,
  credential: emptyWalletCredential,
  directory: EMPTY_WALLET_TEST_DIRECTORY,
  validationBypass: true,
});
