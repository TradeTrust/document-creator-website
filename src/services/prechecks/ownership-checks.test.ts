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
      getNetwork: () => ({ name: "goerli", chainId: 5 }),
    },
    getAddress: () => {
      return owner;
    },
  } as any);

const mockDocumentStoreResponse = ({ dsOwner = "0x1234", error = false }) => {
  mockCheckAddressIsSmartContract.mockImplementation(() => {
    return !error;
  });
  mockGetConnectedDocumentStore.mockResolvedValue({
    owner: () => {
      return dsOwner;
    },
  });
};

const mockTokenRegistryResponse = ({ trMinter = "0x1234", error = false }) => {
  mockCheckAddressIsSmartContract.mockImplementation(() => {
    return !error;
  });
  mockGetConnectedTokenRegistry.mockResolvedValue({
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
    it("should return true for valid document ownership", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({});
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toBe(true);
    });

    it("should return false for invalid document store", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({ error: true });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toBe(false);
    });

    it("should return false for unowned document store", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({ dsOwner: "0x10101010" });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkVerifiableDocumentOwnership(contractAddress, wallet);

      expect(status).toBe(false);
    });
  });

  describe("checkTransferableRecordOwnership", () => {
    it("should return true for valid record ownership", async () => {
      const wallet = mockWallet();
      mockTokenRegistryResponse({});
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(status).toBe(true);
    });

    it("should return fail for invalid record ownership", async () => {
      const wallet = mockWallet();
      mockTokenRegistryResponse({ trMinter: "0x10101010" });
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(status).toBe(false);
    });
  });

  describe("checkDID", () => {
    it("should return true for v3 DID OA Document", async () => {
      const results = checkDID(sampleV3DID as v3.OpenAttestationDocument);
      expect(results).toBe(true);
    });
  });
});
