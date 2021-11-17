import { join } from "path";
import {
  didCredential,
  localCredential,
  rinkebyCredential,
  ropstenAWSCredential,
  ropstenCredential,
} from "./credential";
import { documentFormsV2 } from "./forms/v2";
import { documentFormsV3 } from "./forms/v3";
import { documentFormsLocal } from "./forms/local";
import { generateConfigFile } from "./generator";
import { EmptyConfig, Forms } from "./types";

const configFile: EmptyConfig = {
  network: "",
  wallet: {},
  forms: [],
};

const formsV2: Forms[] = [{ version: "v2", forms: documentFormsV2 }];
const formsV3: Forms[] = [{ version: "v3", forms: documentFormsV3 }];
const allForms: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v3", forms: documentFormsV3 },
];

const V2_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten.json");
const V2_AWS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-ropsten-aws.json");
const V2_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-rinkeby.json");
const V2_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-did.json");
const V2_LOCAL_DIRECTORY = join(__dirname, "_generated-config-files", "v2", "sample-config-local.json");

const V3_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-ropsten.json");
const V3_RINKEBY_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-rinkeby.json");
const V3_DID_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-did.json");
const V3_LOCAL_DIRECTORY = join(__dirname, "_generated-config-files", "v3", "sample-config-local.json");

const ALL_FORMS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "sample-config-ropsten.json");

generateConfigFile(configFile, formsV2, ropstenCredential, V2_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV2, ropstenAWSCredential, V2_AWS_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV2, rinkebyCredential, V2_RINKEBY_DIRECTORY);
generateConfigFile(configFile, formsV2, didCredential, V2_DID_DIRECTORY);
generateConfigFile(configFile, formsV2, localCredential, V2_LOCAL_DIRECTORY);

generateConfigFile(configFile, formsV3, ropstenCredential, V3_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV3, rinkebyCredential, V3_RINKEBY_DIRECTORY);
generateConfigFile(configFile, formsV3, didCredential, V3_DID_DIRECTORY);
generateConfigFile(configFile, formsV3, localCredential, V3_LOCAL_DIRECTORY);

generateConfigFile(configFile, allForms, ropstenCredential, ALL_FORMS_ROPSTEN_DIRECTORY);

// Generate local config for testing

// Working local document form v2
const v2LocalForms: Forms[] = [
  { version: "v2", forms: documentFormsV2 },
  { version: "v2", forms: documentFormsLocal },
];
const LOCAL_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "sample-config-local.json");
generateConfigFile(configFile, v2LocalForms, localCredential, LOCAL_TEST_DIRECTORY);

// Local configuration file issuer error
const ISSUER_ERROR_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "config-invalid-issuer.json");
const identityProofErrorCredential = {
  ...localCredential,
  identityProof: "ErrorIdentityProof",
};
generateConfigFile(configFile, v2LocalForms, identityProofErrorCredential, ISSUER_ERROR_TEST_DIRECTORY);

// Local configuration empty wallet
const EMPTY_WALLET_TEST_DIRECTORY = join(__dirname, "_generated-config-files", "test", "config-empty-wallet.json");
const emptyWalletCredential = {
  ...localCredential,
  wallet: "",
};
generateConfigFile(configFile, v2LocalForms, emptyWalletCredential, EMPTY_WALLET_TEST_DIRECTORY, true);
