import { configFileV2 } from "./configuration-file.mjs";
import { ropsten, rinkeby, did } from "./credential.mjs";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname, parse } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const V2_ROPSTEN_DIRECTORY = join(__dirname, "_generated", "v2", "config", "ropsten", "sample-config-ropsten.json");
const V2_AWS_ROPSTEN_DIRECTORY = join(
  __dirname,
  "_generated",
  "v2",
  "config",
  "ropsten",
  "sample-config-ropsten-aws.json"
);
const V2_RINKEBY_DIRECTORY = join(__dirname, "_generated", "v2", "config", "rinkeby", "sample-config-rinkeby.json");
const V2_DID_DIRECTORY = join(__dirname, "_generated", "v2", "config", "did", "sample-config-did.json");

const V3_ROPSTEN_DIRECTORY = join(__dirname, "_generated", "v3", "config", "ropsten", "sample-config-ropsten.json");
const V3_RINKEBY_DIRECTORY = join(__dirname, "_generated", "v3", "config", "rinkeby", "sample-config-rinkeby.json");
const V3_DID_DIRECTORY = join(__dirname, "_generated", "v3", "config", "did", "sample-config-did.json");

function generateConfigFile() {
  //Ropsten
  const ropstenConfigFile = JSON.parse(JSON.stringify(configFileV2));
  ropstenConfigFile.network = ropsten.network;
  ropstenConfigFile.wallet = ropsten.wallet;
  ropstenConfigFile.documentStorage.url = ropsten.documentStorageUrl;
  const ropstenConfigFileV2 = insertV2Credential(ropstenConfigFile, ropsten);
  updateConfigFile(ropstenConfigFileV2, V2_ROPSTEN_DIRECTORY);

  //AWS Ropsten
  const ropstenAWSConfigFile = JSON.parse(JSON.stringify(configFileV2));
  ropstenAWSConfigFile.wallet = ropsten.walletAWS;
  updateConfigFile(ropstenAWSConfigFile, V2_AWS_ROPSTEN_DIRECTORY);

  //Rinkeby
  const rinkebyConfigFile = JSON.parse(JSON.stringify(configFileV2));
  rinkebyConfigFile.network = rinkeby.network;
  rinkebyConfigFile.wallet = rinkeby.wallet;
  rinkebyConfigFile.documentStorage.url = rinkeby.documentStorageUrl;
  insertV2Credential(rinkebyConfigFile, rinkeby);
  updateConfigFile(rinkebyConfigFile, V2_RINKEBY_DIRECTORY);

  //DID
  const didConfigFile = JSON.parse(JSON.stringify(configFileV2));
  didConfigFile.network = did.network;
  didConfigFile.wallet = did.wallet;
  delete didConfigFile.documentStorage;
  insertV2Credential(didConfigFile, did, true);
  updateConfigFile(didConfigFile, V2_DID_DIRECTORY);
}

function insertV2Credential(configFile, credential, removeTransferableRecord = false) {
  configFile.forms.forEach((form, index, object) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        //[9/11/2021] DID TRANSFERABLE_RECORD not supported as for now
        if (removeTransferableRecord) {
          object.splice(index, 1);
          return;
        }
        form.defaults.issuers[0] = credential.tokenRegistry;
        break;
      case "VERIFIABLE_DOCUMENT":
        form.defaults.issuers[0] = credential.documentStore;
        break;
      default:
        throw Error("no form type found");
    }
  });
  return configFile;
}

function insertV3Credential(configFile, credential, removeTransferableRecord = false) {
  configFile.forms.forEach((form, index, object) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        //[9/11/2021] DID TRANSFERABLE_RECORD not supported as for now
        if (removeTransferableRecord) {
          object.splice(index, 1);
        }
        const transferableIssuer = {
          id: "https://example.com",
          name: credential.tokenRegistry.name,
          type: "OpenAttestationIssuer",
        };
        const transferableProof = {
          type: "OpenAttestationProofMethod",
          method: "TOKEN_REGISTRY",
          value: credential.tokenRegistry.tokenRegistry,
        };
        const transferableIdentityProof = credential.tokenRegistry.identityProof;

        form.defaults.issuer = transferableIssuer;
        console.log(form.defaults.openAttestationMetadata.proof);
        form.defaults.openAttestationMetadata.proof = transferableProof;
        form.defaults.openAttestationMetadata.identityProof = transferableIdentityProof;
        break;
      case "VERIFIABLE_DOCUMENT":
        const verifiableIssuer = {
          id: "https://example.com",
          name: credential.documentStore.name,
          type: "OpenAttestationIssuer",
        };
        const verifiableProof = {
          type: "OpenAttestationProofMethod",
          method: "DOCUMENT_STORE",
          value: credential.documentStore.documentStore,
        };
        const verifiableIdentityProof = credential.documentStore.identityProof;

        form.defaults.issuer = verifiableIssuer;
        form.defaults.openAttestationMetadata.proof = verifiableProof;
        form.defaults.openAttestationMetadata.identityProof = verifiableIdentityProof;
        break;
      default:
        throw Error("no form type found");
    }
  });
  return configFile;
}

function updateConfigFile(configFile, directory) {
  try {
    if (!existsSync(parse(directory).dir)) {
      mkdirSync(parse(directory).dir, { recursive: true });
    }
    writeFileSync(directory, JSON.stringify(configFile));
  } catch (e) {
    console.log(e);
  }
}

generateConfigFile();
