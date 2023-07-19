import { v3 } from "@govtechsg/open-attestation";
import sampleV3DID from "../../test/fixtures/sample-files/v3/did/sample-v3-did-wrapped.json";
import { checkDID, checkTransferableRecordOwnership, checkVerifiableDocumentOwnership } from "./ownership-checks";
import { getConnectedDocumentStore, checkAddressIsSmartContract, getConnectedTokenRegistry } from "../common";
import { Wallet } from "ethers";

jest.mock("../common", () => {
  const originalModule = jest.requireActual("../common");

  return {
    __esModule: true,
    ...originalModule,
    getConnectedDocumentStore: jest.fn(),
    checkAddressIsSmartContract: jest.fn(),
    getConnectedTokenRegistry: jest.fn(),
  };
});

const mockCheckAddressIsSmartContract = checkAddressIsSmartContract as jest.Mock;
const mockGetConnectedDocumentStore = getConnectedDocumentStore as jest.Mock;
const mockGetConnectedTokenRegistry = getConnectedTokenRegistry as jest.Mock;

const resetMocks = (mocks: jest.Mock[]): void => mocks.forEach((mock) => mock.mockReset());

const mockWallet = (code = "0x1234", owner = "0x1234"): Wallet =>
  ({
    provider: {
      getCode: () => code,
      getNetwork: () => ({ name: "sepolia", chainId: 11155111 }),
    },
    getAddress: () => {
      return owner;
    },
  } as any);

const mockDocumentStoreResponse = ({ hasRole = true, error = false }) => {
  mockCheckAddressIsSmartContract.mockImplementation(() => {
    return !error;
  });
  mockGetConnectedDocumentStore.mockResolvedValue({
    hasRole: () => {
      return hasRole;
    },
  });
};

const mockTokenRegistryResponse = ({ trMinter = "0x1234", contractError = false, interfaceError = false }) => {
  mockCheckAddressIsSmartContract.mockImplementation(() => {
    return !contractError;
  });
  mockGetConnectedTokenRegistry.mockResolvedValue({
    supportsInterface: () => {
      return !interfaceError;
    },
    MINTER_ROLE: () => {
      "0x0";
    },
    hasRole: (role: string, address: string) => {
      return Promise.resolve(address === trMinter);
    },
  });
};

describe("ownershipChecks", () => {
  beforeEach(() => {
    resetMocks([mockGetConnectedDocumentStore, mockCheckAddressIsSmartContract, mockGetConnectedTokenRegistry]);
  });

  describe("checkVerifiableDocumentOwnership", () => {
    it("should return VALID for valid document ownership", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({});
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toBe("VALID");
    });

    it("should return false for invalid document store", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({ error: true });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toStrictEqual({ type: "ownership", message: "Invalid or Unsupported smart contract" });
    });

    it("should return false for unowned or not issuer on document store", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({ hasRole: false });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toStrictEqual({ type: "ownership", message: "Document Store is not owned by wallet" });
    });
  });

  describe("checkTransferableRecordOwnership", () => {
    it("should return true for valid record ownership", async () => {
      const wallet = mockWallet();
      mockTokenRegistryResponse({});
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(status).toBe("VALID");
    });

    it("should return fail for invalid record ownership", async () => {
      const wallet = mockWallet();
      mockTokenRegistryResponse({ trMinter: "0x10101010" });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(status).toStrictEqual({
        type: "ownership",
        message: "Wallet do not have permission to mint on Token Registry",
      });
    });
  });

  describe("checkDID", () => {
    it("should return true for v3 DID OA Document", async () => {
      const results = checkDID(sampleV3DID as v3.OpenAttestationDocument);
      expect(results).toBe(true);
    });
  });
});
