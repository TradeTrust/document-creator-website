import { v3 } from "@govtechsg/open-attestation";
import sampleV3DID from "../../test/fixtures/sample-files/v3/did/sample-v3-did-wrapped.json";
import { checkCreationAddress } from "./utils";
import { checkDID, checkTransferableRecordOwnership, checkVerifiableDocumentOwnership } from "./ownership-checks";
import { getConnectedDocumentStore, assertAddressIsSmartContract } from "../publishing";
import { Wallet } from "ethers";

jest.mock("../publishing", () => {
  const originalModule = jest.requireActual("../publishing");

  return {
    __esModule: true,
    ...originalModule,
    getConnectedDocumentStore: jest.fn(),
    assertAddressIsSmartContract: jest.fn(),
  };
});

jest.mock("./utils", () => {
  const originalModule = jest.requireActual("./utils");

  return {
    __esModule: true,
    ...originalModule,
    checkCreationAddress: jest.fn(),
  };
});

const mockAssertAddressIsSmartContract = assertAddressIsSmartContract as jest.Mock;
const mockGetConnectedDocumentStore = getConnectedDocumentStore as jest.Mock;
const mockCheckCreationAddress = checkCreationAddress as jest.Mock;

const resetMocks = (mocks: jest.Mock[]): void => mocks.forEach((mock) => mock.mockReset());

const mockWallet = (code = "0x1234", owner = "0x1234"): Wallet =>
  ({
    provider: {
      getCode: () => code,
      getNetwork: () => ({ name: "ropsten", chainId: 3 }),
    },
    getAddress: () => {
      return owner;
    },
  } as any);

const mockDocumentStoreResponse = ({ dsOwner = "0x1234", error = false }) => {
  mockAssertAddressIsSmartContract.mockImplementation(() => {
    if (error) throw new Error("Address is not a smart contract");
  });
  mockGetConnectedDocumentStore.mockResolvedValue({
    owner: () => {
      return dsOwner;
    },
  });
};

describe("ownershipChecks", () => {
  beforeEach(() => {
    resetMocks([mockGetConnectedDocumentStore, mockAssertAddressIsSmartContract, mockCheckCreationAddress]);
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
      mockDocumentStoreResponse({});
      mockCheckCreationAddress.mockResolvedValue(true);
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(mockCheckCreationAddress).toBeCalledTimes(1);
      const network = await wallet.provider.getNetwork();
      expect(mockCheckCreationAddress).toHaveBeenCalledWith(
        contractAddress,
        {
          network: {
            chain: network.name,
            chainId: network.chainId.toString(),
          },
        },
        wallet.getAddress(),
        false
      );
      expect(status).toBe(true);
    });

    it("should return fail for invalid record ownership", async () => {
      const wallet = mockWallet();
      mockDocumentStoreResponse({});
      mockCheckCreationAddress.mockResolvedValue(false);
      const contractAddress = "0x154fcc3c953057c9527eb180cad321b906412b5d";
      const status = await checkTransferableRecordOwnership(contractAddress, wallet);
      expect(mockCheckCreationAddress).toBeCalledTimes(1);
      const network = await wallet.provider.getNetwork();
      expect(mockCheckCreationAddress).toHaveBeenCalledWith(
        contractAddress,
        {
          network: {
            chain: network.name,
            chainId: network.chainId.toString(),
          },
        },
        wallet.getAddress(),
        false
      );
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
