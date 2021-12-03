import path, { join } from "path";
import fs from "fs";
import { generateConfigFile } from "./generator";
import { EmptyConfig, Forms } from "./types";
import {
  didCredential,
  localCredential,
  rinkebyCredential,
  ropstenAWSCredential,
  ropstenCredential,
} from "./credential";

const dirFormsLocal = path.join(__dirname, "forms", "local");
const dirFormsV2 = path.join(__dirname, "forms", "v2");
const dirFormsV3 = path.join(__dirname, "forms", "v3");

const getForms = (dir: string) => {
  const forms: any[] = [];
  fs.readdirSync(dir).forEach((filename) => {
    const content = fs.readFileSync(path.join(dir, filename), "utf-8");
    forms.push(JSON.parse(content));
  });
  return forms;
};

// Configuration base file
const configFileEmpty: EmptyConfig = {
  network: "",
  wallet: "",
  forms: [],
};

// Forms preparation
const documentFormsV2Local = getForms(dirFormsLocal);
const documentFormsV2 = getForms(dirFormsV2);
const documentFormsV3 = getForms(dirFormsV3);

const formsV2: Forms[] = [{ version: "v2", forms: documentFormsV2 }];
const formsV3: Forms[] = [{ version: "v3", forms: documentFormsV3 }];
const formsV2AndV3: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v3", forms: documentFormsV3 },
];
const didFormsV2: Forms[] = [{ version: "v2-did", forms: documentFormsV2 }];
const didFormsV3: Forms[] = [{ version: "v3-did", forms: documentFormsV3 }];

const localForms: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v2", forms: documentFormsV2Local },
  { version: "v3", forms: documentFormsV3 },
];

// Generate Configuration Files
const V2_AND_V3_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV2AndV3,
  credential: ropstenCredential,
  directory: V2_AND_V3_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

const V2_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV2,
  credential: ropstenCredential,
  directory: V2_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

const V2_AWS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten-aws.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV2,
  credential: ropstenAWSCredential,
  directory: V2_AWS_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

const V2_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-rinkeby.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV2,
  credential: rinkebyCredential,
  directory: V2_RINKEBY_DIRECTORY,
  validationBypass: false,
});

const V2_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-did.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: didFormsV2,
  credential: didCredential,
  directory: V2_DID_DIRECTORY,
  validationBypass: false,
});

const V3_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-ropsten.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV3,
  credential: ropstenCredential,
  directory: V3_ROPSTEN_DIRECTORY,
  validationBypass: false,
});

const V3_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-rinkeby.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: formsV3,
  credential: rinkebyCredential,
  directory: V3_RINKEBY_DIRECTORY,
  validationBypass: false,
});

const V3_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-did.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: didFormsV3,
  credential: didCredential,
  directory: V3_DID_DIRECTORY,
  validationBypass: false,
});

// Generate local config fixtures for various testing
const LOCAL_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "sample-config-local.json");
generateConfigFile({
  configFile: configFileEmpty,
  formsList: localForms,
  credential: localCredential,
  directory: LOCAL_TEST_DIRECTORY,
  validationBypass: false,
});

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
  configFile: configFileEmpty,
  formsList: localForms,
  credential: identityProofErrorCredential,
  directory: ISSUER_ERROR_TEST_DIRECTORY,
  validationBypass: false,
});

const EMPTY_WALLET_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "config-empty-wallet.json");
const emptyWalletCredential = {
  ...localCredential,
  wallet: "",
};
generateConfigFile({
  configFile: configFileEmpty,
  formsList: localForms,
  credential: emptyWalletCredential,
  directory: EMPTY_WALLET_TEST_DIRECTORY,
  validationBypass: true,
});
