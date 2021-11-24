import { Credential, DidCredential, Forms, GenerateConfigFileProps } from "./types";
import { existsSync, writeFileSync, mkdirSync } from "fs";
import { parse } from "path";
import { assertConfigFile } from "../../../common/config/validate";

export const generateConfigFile = ({
  configFile,
  formsList,
  credential,
  directory,
  validationBypass,
}: GenerateConfigFileProps): void => {
  try {
    const { network, wallet, documentStorage } = credential;

    formsList = formsList.map(({ version, forms }: Forms) => {
      switch (version) {
        case "v2":
          return insertV2Credential(forms, credential);
        case "v2-did":
          // Transferable record not supported in DID
          forms = forms.filter((form: any) => form.type != "TRANSFERABLE_RECORD");
          return insertV2Credential(forms, credential, true);
        case "v3":
          return insertV3Credential(forms, credential);
        case "v3-did":
          // Transferable record not supported in DID
          forms = forms.filter((form: any) => form.type != "TRANSFERABLE_RECORD");
          return insertV3Credential(forms, credential, true);
        default:
          throw Error("Please indicate forms version");
      }
    });

    const generatedConfig = {
      ...configFile,
      network,
      wallet,
      documentStorage,
      forms: formsList.flat(),
    };

    updateConfigFile(generatedConfig, directory, validationBypass);
  } catch (e: any) {
    console.error(e.message);
  }
};

function insertV2Credential(forms: any, credential: Credential | DidCredential, generateDid = false) {
  return forms.map((form: any) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        const transferableRecordCredential = credential as Credential;
        const transferableRecordIssuer = {
          identityProof: {
            type: "DNS-TXT",
            location: transferableRecordCredential.identityProof,
          },
          name: "DEMO TOKEN REGISTRY",
          tokenRegistry: transferableRecordCredential.tokenRegistry,
        };

        return {
          ...form,
          defaults: {
            ...form.defaults,
            issuers: [transferableRecordIssuer],
          },
        };
      case "VERIFIABLE_DOCUMENT":
        let verifiableDocumentIssuer;

        if (generateDid) {
          const didCredential = credential as DidCredential;
          verifiableDocumentIssuer = {
            id: didCredential.didAddress,
            name: "DEMO DID",
            revocation: didCredential.revocation,
            identityProof: {
              type: "DNS-DID",
              key: `${didCredential.didAddress}#controller`,
              location: didCredential.identityProof,
            },
          };
        } else {
          const verifiableDocumentCredential = credential as Credential;
          verifiableDocumentIssuer = {
            identityProof: {
              type: "DNS-TXT",
              location: verifiableDocumentCredential.identityProof,
            },
            name: "DEMO DOCUMENT STORE",
            documentStore: verifiableDocumentCredential.documentStore,
          };
        }

        return {
          ...form,
          defaults: {
            ...form.defaults,
            issuers: [verifiableDocumentIssuer],
          },
        };
      default:
        throw Error("no form type found");
    }
  });
}

function insertV3Credential(forms: any, credential: Credential | DidCredential, generateDid = false) {
  return forms.map((form: any) => {
    switch (form.type) {
      case "TRANSFERABLE_RECORD":
        const transferableRecordCredential = credential as Credential;

        const transferableIssuer = {
          id: "https://example.com",
          name: "DEMO TOKEN REGISTRY",
          type: "OpenAttestationIssuer",
        };

        const transferableProof = {
          type: "OpenAttestationProofMethod",
          method: "TOKEN_REGISTRY",
          value: transferableRecordCredential.tokenRegistry,
        };

        const transferableIdentityProof = {
          type: "DNS-TXT",
          identifier: transferableRecordCredential.identityProof,
        };

        return {
          ...form,
          defaults: {
            ...form.defaults,
            issuer: transferableIssuer,
            openAttestationMetadata: {
              ...form.defaults.openAttestationMetadata,
              proof: transferableProof,
              identityProof: transferableIdentityProof,
            },
          },
        };

      case "VERIFIABLE_DOCUMENT":
        let verifiableIssuer;
        let verifiableProof;
        let verifiableIdentityProof;

        if (generateDid) {
          const didCredential = credential as DidCredential;
          verifiableIssuer = {
            id: "https://example.com",
            name: "DEMO DID",
            type: "OpenAttestationIssuer",
          };
          verifiableProof = {
            type: "OpenAttestationProofMethod",
            method: "DID",
            value: didCredential.didAddress,
            revocation: didCredential.revocation,
          };
          verifiableIdentityProof = {
            type: "DNS-DID",
            identifier: didCredential.identityProof,
          };
        } else {
          const verifiableDocumentCredential = credential as Credential;

          verifiableIssuer = {
            id: "https://example.com",
            name: "DEMO DOCUMENT STORE",
            type: "OpenAttestationIssuer",
          };
          verifiableProof = {
            type: "OpenAttestationProofMethod",
            method: "DOCUMENT_STORE",
            value: verifiableDocumentCredential.documentStore,
          };
          verifiableIdentityProof = {
            type: "DNS-TXT",
            identifier: verifiableDocumentCredential.identityProof,
          };
        }

        return {
          ...form,
          defaults: {
            ...form.defaults,
            issuer: verifiableIssuer,
            openAttestationMetadata: {
              ...form.defaults.openAttestationMetadata,
              proof: verifiableProof,
              identityProof: verifiableIdentityProof,
            },
          },
        };
      default:
        throw Error("no form type found");
    }
  });
}

function updateConfigFile(configFile: any, directory: string, validationBypass = false) {
  if (!validationBypass) {
    assertConfigFile(configFile);
  }

  if (!existsSync(parse(directory).dir)) {
    mkdirSync(parse(directory).dir, { recursive: true });
  }
  writeFileSync(directory, JSON.stringify(configFile, null, 2));
}
