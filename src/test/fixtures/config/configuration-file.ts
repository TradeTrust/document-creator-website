import { join } from "path";
import { v2CooChafta, v2BillOfLading, v2CoverLetter, v2Invoice } from "./forms/v2";
import { v3BillOfLading, v3CooChafta, v3Invoice } from "./forms/v3";
import { CoverLetterExtension, CoverLetterNoUiSchema } from "./forms/local";
import { generateConfigFile } from "./generator";
import { EmptyConfig, Forms } from "./types";
import {
  didCredential,
  localCredential,
  rinkebyCredential,
  ropstenAWSCredential,
  ropstenCredential,
} from "./credential";

/**
 *  Configuration file schema
 */

const configFile: EmptyConfig = {
  network: "",
  wallet: "",
  forms: [],
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

/**
 *  Generate Configuration Files
 */

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
