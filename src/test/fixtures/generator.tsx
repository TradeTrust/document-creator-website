import { configFileV2, configFileV3 } from "./configuration-file";
import { ropsten, rinkeby, did } from "./credential";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { join, parse } from "path";
import { assertConfigFile } from "../../common/config/validate";

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

function generateConfigFile(configFile: any, version: string) {
  try {
    //Ropsten
    const ropstenConfigFile = {
      ...configFile,
      network: ropsten.network,
      wallet: ropsten.wallet,
      documentStorage: {
        ...configFile.documentStorage,
        url: ropsten.documentStorageUrl,
      },
    };
    if (version === "v2") {
      const ropstenConfigFileV2 = insertV2Credential(ropstenConfigFile, ropsten);
      updateConfigFile(ropstenConfigFileV2, V2_ROPSTEN_DIRECTORY);
    } else {
      const ropstenConfigFileV3 = insertV3Credential(ropstenConfigFile, ropsten);
      updateConfigFile(ropstenConfigFileV3, V3_ROPSTEN_DIRECTORY);
    }

    //AWS Ropsten
    const ropstenAWSConfigFile = {
      ...configFile,
      network: ropsten.network,
      wallet: ropsten.walletAWS,
      documentStorage: {
        ...configFile.documentStorage,
        url: ropsten.documentStorageUrl,
      },
    };
    if (version === "v2") {
      updateConfigFile(ropstenAWSConfigFile, V2_AWS_ROPSTEN_DIRECTORY);
    }

    //Rinkeby
    const rinkebyConfigFile = {
      ...configFile,
      network: rinkeby.network,
      wallet: rinkeby.wallet,
      documentStorage: {
        ...configFile.documentStorage,
        url: rinkeby.documentStorageUrl,
      },
    };
    if (version === "v2") {
      const rinkebyConfigFileV2 = insertV2Credential(rinkebyConfigFile, rinkeby);
      updateConfigFile(rinkebyConfigFileV2, V2_RINKEBY_DIRECTORY);
    } else {
      const rinkebyConfigFileV3 = insertV3Credential(rinkebyConfigFile, rinkeby);
      updateConfigFile(rinkebyConfigFileV3, V3_RINKEBY_DIRECTORY);
    }

    //DID
    const didConfigFile = {
      ...configFile,
      network: did.network,
      wallet: did.wallet,
    };
    delete didConfigFile.documentStorage;
    if (version === "v2") {
      const didConfigFileV2 = insertV2Credential(didConfigFile, did, true);
      updateConfigFile(didConfigFileV2, V2_DID_DIRECTORY);
    } else {
      const didConfigFileV3 = insertV3Credential(didConfigFile, did, true);
      updateConfigFile(didConfigFileV3, V3_DID_DIRECTORY);
    }
  } catch (e: any) {
    console.log(e.message);
  }
}

function insertV2Credential(configFile: any, credential: any, generateDid = false) {
  configFile.forms.forEach((form: any, index: number, object: any) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        //[9/11/2021] DID TRANSFERABLE_RECORD not supported as for now
        if (generateDid) {
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

function insertV3Credential(configFile: any, credential: any, generateDid = false) {
  configFile.forms.forEach((form: any, index: number, object: any) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        //[9/11/2021] DID TRANSFERABLE_RECORD not supported as for now
        if (generateDid) {
          object.splice(index, 1);
          return;
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
        form.defaults.openAttestationMetadata.proof = transferableProof;
        form.defaults.openAttestationMetadata.identityProof = transferableIdentityProof;
        break;
      case "VERIFIABLE_DOCUMENT":
        let verifiableIssuer = {};
        let verifiableProof = {};
        let verifiableIdentityProof = {};
        if (generateDid) {
          verifiableIssuer = {
            id: "https://example.com",
            name: credential.issuer.name,
            type: "OpenAttestationIssuer",
          };
          verifiableProof = {
            type: "OpenAttestationProofMethod",
            method: "DID",
            value: credential.issuer.id,
            revocation: credential.issuer.revocation,
          };
          verifiableIdentityProof = {
            type: "DNS-DID",
            identifier: credential.issuer.identityProof.location,
          };
        } else {
          verifiableIssuer = {
            id: "https://example.com",
            name: credential.documentStore.name,
            type: "OpenAttestationIssuer",
          };
          verifiableProof = {
            type: "OpenAttestationProofMethod",
            method: "DOCUMENT_STORE",
            value: credential.documentStore.documentStore,
          };
          verifiableIdentityProof = credential.documentStore.identityProof;
        }

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

function updateConfigFile(configFile: any, directory: string) {
  assertConfigFile(configFile);
  if (!existsSync(parse(directory).dir)) {
    mkdirSync(parse(directory).dir, { recursive: true });
  }
  writeFileSync(directory, JSON.stringify(configFile, null, 2));
}

generateConfigFile(configFileV2, "v2");
generateConfigFile(configFileV3, "v3");
