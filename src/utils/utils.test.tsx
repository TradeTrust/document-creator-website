import { v2, v3 } from "@govtechsg/open-attestation";
import { getDnsDidRecords, getDocumentStoreRecords } from "@govtechsg/dnsprove";
import {
  generateFileName,
  getIssuerLocation,
  getIdentityProofType,
  getIssuerAddress,
  validateDnsTxtRecords,
} from "./utils";
import { FormTemplate } from "../types";

jest.mock("@govtechsg/dnsprove", () => ({
  getDnsDidRecords: jest.fn(),
  getDocumentStoreRecords: jest.fn(),
}));
const mockGetDnsDidRecords = getDnsDidRecords as jest.Mock;
const mockGetDocumentStoreRecords = getDocumentStoreRecords as jest.Mock;

const mockRecordsDnsDid = [
  {
    type: "openatts",
    algorithm: "dns-did",
    publicKey: "did:ethr:0x123B86fC8FCE13c4A0f452Cd0A8AB5b6b3e3A4f3#controller",
    version: "1.0",
    dnssec: true,
  },
  {
    type: "openatts",
    algorithm: "dns-did",
    publicKey: "did:ethr:0x1245e5B64D785b25057f7438F715f4aA5D965733#controller",
    version: "1.0",
    dnssec: true,
  },
];

const mockRecordsDnsTxt = [
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x10E936e6BA85dC92505760259881167141365821",
    dnssec: true,
  },
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
    dnssec: true,
  },
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    dnssec: true,
  },
];

describe("generateFileName", () => {
  it("should generate the file name correctly with the given config and file name", async () => {
    const fileName = generateFileName({
      network: "ropsten",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1-ropsten.tt");
  });

  it("should generate the file name correctly when config.network is 'homestead'", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "tt",
    });

    expect(fileName).toStrictEqual("document-1.tt");
  });

  it("should generate the extension correctly", async () => {
    const fileName = generateFileName({
      network: "homestead",
      fileName: "document-1",
      extension: "txt",
    });

    expect(fileName).toStrictEqual("document-1.txt");
  });
});

describe("generateErrorLogFileName", () => {
  it("should generate the correct date time at the end of the error log file name", () => {
    const mockDate = new Date(1572393600000);
    const RealDate = Date;
    (global as any).Date = class extends RealDate {
      constructor() {
        super();
        return mockDate;
      }
    };

    const fileName = generateFileName({
      network: "ropsten",
      fileName: "error-log",
      extension: "tt",
      hasTimestamp: true,
    });

    expect(fileName).toStrictEqual("error-log-ropsten-2019-10-30T00:00:00.000Z.tt");

    global.Date = RealDate;
  });
});

const mockInvoiceV2: FormTemplate = {
  name: "TradeTrust Invoice v2",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    $template: {
      type: v2.TemplateType.EmbeddedRenderer,
      name: "INVOICE",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "Demo Issuer",
        documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: v2.IdentityProofType.DNSTxt,
          location: "demo-tradetrust.openattestation.com",
        },
        revocation: {
          type: v2.RevocationType.None,
        },
      },
    ],
  },
  schema: {},
};

const mockInvoiceV2DnsDid: FormTemplate = {
  name: "TradeTrust Invoice v2",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    $template: {
      type: v2.TemplateType.EmbeddedRenderer,
      name: "INVOICE",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        id: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
        name: "Demo DNS-DID",
        identityProof: {
          type: v2.IdentityProofType.DNSDid,
          location: "demo-tradetrust.openattestation.com",
          key: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733#controller",
        },
        revocation: {
          type: v2.RevocationType.None,
        },
      },
    ],
  },
  schema: {},
};

const mockInvoiceV3: FormTemplate = {
  name: "TradeTrust Invoice v3",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
      "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuanceDate: "2010-01-01T19:23:24Z",
    openAttestationMetadata: {
      template: {
        type: v3.TemplateType.EmbeddedRenderer,
        name: "INVOICE",
        url: "https://generic-templates.tradetrust.io",
      },
      proof: {
        type: v3.ProofType.OpenAttestationProofMethod,
        method: v3.Method.DocumentStore,
        value: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        revocation: {
          type: v3.RevocationType.None,
        },
      },
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "demo-tradetrust.openattestation.com",
      },
    },
    credentialSubject: {},
    issuer: {
      id: "https://example.com",
      name: "DEMO DOCUMENT STORE",
      type: "OpenAttestationIssuer",
    },
  },
  schema: {},
};

const mockInvoiceV3DnsDid: FormTemplate = {
  name: "TradeTrust Invoice v3",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://schemata.openattestation.com/io/tradetrust/Invoice/1.0/invoice-context.json",
      "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    ],
    type: ["VerifiableCredential", "OpenAttestationCredential"],
    issuanceDate: "2010-01-01T19:23:24Z",
    openAttestationMetadata: {
      template: {
        type: v3.TemplateType.EmbeddedRenderer,
        name: "INVOICE",
        url: "https://generic-templates.tradetrust.io",
      },
      proof: {
        type: v3.ProofType.OpenAttestationProofMethod,
        method: v3.Method.Did,
        value: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
        revocation: {
          type: v3.RevocationType.None,
        },
      },
      identityProof: {
        type: v3.IdentityProofType.DNSTxt,
        identifier: "demo-tradetrust.openattestation.com",
      },
    },
    credentialSubject: {},
    issuer: {
      id: "https://example.com",
      name: "DEMO DOCUMENT STORE",
      type: "OpenAttestationIssuer",
    },
  },
  schema: {},
};

describe("getIssuerLocation", () => {
  it("should return dns location from raw document v2", () => {
    const location = getIssuerLocation(mockInvoiceV2.defaults);
    expect(location).toBe("demo-tradetrust.openattestation.com");
  });

  it("should return dns location from raw document v3", () => {
    const location = getIssuerLocation(mockInvoiceV3.defaults);
    expect(location).toBe("demo-tradetrust.openattestation.com");
  });
});

describe("getIdentityProofType", () => {
  it("should return identity proof type from raw document v2", () => {
    const method = getIdentityProofType(mockInvoiceV2.defaults);
    expect(method).toBe("DNS-TXT");
  });

  it("should return identity proof type from raw document v3", () => {
    const method = getIdentityProofType(mockInvoiceV3.defaults);
    expect(method).toBe("DNS-TXT");
  });
});

describe("getIssuerAddress", () => {
  it("should return issuer address from raw document v2", () => {
    const address = getIssuerAddress(mockInvoiceV2.defaults);
    expect(address).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should return issuer address from raw document v3", () => {
    const address = getIssuerAddress(mockInvoiceV3.defaults);
    expect(address).toBe("0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca");
  });

  it("should return issuer address from raw document v2 (dns-did)", () => {
    const address = getIssuerAddress(mockInvoiceV2DnsDid.defaults);
    expect(address).toBe("0x1245e5b64d785b25057f7438f715f4aa5d965733");
  });

  it("should return issuer address from raw document v3 (dns-did)", () => {
    const address = getIssuerAddress(mockInvoiceV3DnsDid.defaults);
    expect(address).toBe("0x1245e5b64d785b25057f7438f715f4aa5d965733");
  });
});

describe("validateDnsTxtRecords", () => {
  it("should return true for DNS-TXT method if address exists on dns regardless of text casing", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x8BA63EAB43342AAC3ADBB4B827B68CF4AAE5CACA",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return true for DNS-TXT method if address exists on dns", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return false for DNS-TXT method if address not exists on dns", async () => {
    mockGetDocumentStoreRecords.mockReturnValue(mockRecordsDnsTxt);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSTxt,
      issuerLocation: "example.com",
      issuerAddress: "0x0x987654321",
    });
    expect(isDnsValidated).toBe(false);
  });

  it("should return true for DNS-DID method if address exists on dns", async () => {
    mockGetDnsDidRecords.mockReturnValue(mockRecordsDnsDid);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSDid,
      issuerLocation: "example.com",
      issuerAddress: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733#controller",
    });
    expect(isDnsValidated).toBe(true);
  });

  it("should return false for DNS-DID method if address not exists on dns", async () => {
    mockGetDnsDidRecords.mockReturnValue(mockRecordsDnsDid);
    const isDnsValidated = await validateDnsTxtRecords({
      identityProofType: v2.IdentityProofType.DNSDid,
      issuerLocation: "example.com",
      issuerAddress: "did:ethr:0x987654321#controller",
    });
    expect(isDnsValidated).toBe(false);
  });
});
