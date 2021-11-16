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

const ALL_FORMS_ROPSTEN_DIRECTORY = join(__dirname, "_generated-config-files", "sample-config-ropsten.json");

generateConfigFile(configFile, formsV2, ropstenCredential, V2_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV2, ropstenAWSCredential, V2_AWS_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV2, rinkebyCredential, V2_RINKEBY_DIRECTORY);
generateConfigFile(configFile, formsV2, didCredential, V2_DID_DIRECTORY);
generateConfigFile(configFile, formsV2, localCredential, V2_LOCAL_DIRECTORY);

generateConfigFile(configFile, formsV3, ropstenCredential, V3_ROPSTEN_DIRECTORY);
generateConfigFile(configFile, formsV3, rinkebyCredential, V3_RINKEBY_DIRECTORY);
generateConfigFile(configFile, formsV3, didCredential, V3_DID_DIRECTORY);

generateConfigFile(configFile, allForms, ropstenCredential, ALL_FORMS_ROPSTEN_DIRECTORY);
