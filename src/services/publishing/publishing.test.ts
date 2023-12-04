import { connect } from "@tradetrust-tt/document-store";
import { TradeTrustToken__factory } from "@tradetrust-tt/token-registry/contracts";
import { Wallet } from "ethers";
import { supportsInterface } from "../common/utils";
import { publishTransferableRecordJob, publishVerifiableDocumentJob } from "./index";

jest.mock("@tradetrust-tt/token-registry/contracts");
jest.mock("@tradetrust-tt/document-store");
jest.mock("../common/utils");

const mockDocumentStoreConnect = connect as jest.Mock;
const mockTradeTrustTokenFactoryConnect = TradeTrustToken__factory.connect as jest.Mock;
const mockDocumentStoreIssue = jest.fn();
const mockTokenRegistryMint = jest.fn();
const mockTxWait = jest.fn();
const mockSupportsInterface = supportsInterface as jest.Mock;

const mockDocumentStore = {
  issue: mockDocumentStoreIssue,
};

const mockTokenRegistry = {
  mint: mockTokenRegistryMint,
};

const mockTransactionReceipt = {
  wait: mockTxWait,
};

const whenDocumentStoreExist = (): void => {
  mockTxWait.mockResolvedValue({
    transactionHash: "TX_HASH",
  });
  mockDocumentStoreIssue.mockResolvedValue(mockTransactionReceipt);
  mockDocumentStoreConnect.mockResolvedValue(mockDocumentStore);
};

const whenTokenRegistryExist = (): void => {
  mockTxWait.mockResolvedValue({
    transactionHash: "TX_HASH",
    events: [{ event: "TitleEscrowDeployed", args: ["0x7777"] }],
  });
  mockTokenRegistryMint.mockResolvedValue(mockTransactionReceipt);
  mockTradeTrustTokenFactoryConnect.mockReturnValue(mockTokenRegistry);
};

const resetMocks = (mocks: jest.Mock[]): void => mocks.forEach((mock) => mock.mockReset());

const mockWallet = ({ code = "0x1234" } = {}): Wallet =>
  ({ provider: { getCode: () => code, getNetwork: () => ({ name: "ropsten" }) } } as any);

describe("publishing", () => {
  beforeEach(() => {
    resetMocks([mockDocumentStoreConnect, mockDocumentStoreIssue, mockTxWait]);
  });

  describe("publishVerifiableDocumentJob", () => {
    it("should return transaction hash when publishing succeed", async () => {
      whenDocumentStoreExist();
      const wallet = mockWallet();
      mockSupportsInterface.mockResolvedValueOnce(false);
      const hash = await publishVerifiableDocumentJob(
        {
          nonce: 1234,
          type: "VERIFIABLE_DOCUMENT",
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          merkleRoot: "9999",
          payload: {},
        },
        wallet
      );

      expect(hash).toBe("TX_HASH");
      expect(mockTxWait).toHaveBeenCalledTimes(1);
      expect(mockDocumentStoreIssue).toHaveBeenCalledWith("0x9999");
    });

    it("should throw when document store address is not a smart contract", async () => {
      whenDocumentStoreExist();
      const wallet = mockWallet({ code: "0x" });

      await expect(
        publishVerifiableDocumentJob(
          {
            nonce: 1234,
            type: "VERIFIABLE_DOCUMENT",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {},
          },
          wallet
        )
      ).rejects.toThrow(/Address is not a smart contract/);
    });

    it("should throw when transaction fails", async () => {
      whenDocumentStoreExist();
      mockSupportsInterface.mockResolvedValueOnce(false);
      mockTxWait.mockRejectedValueOnce(new Error("Some error"));
      const wallet = mockWallet();

      await expect(
        publishVerifiableDocumentJob(
          {
            nonce: 1234,
            type: "VERIFIABLE_DOCUMENT",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {},
          },
          wallet
        )
      ).rejects.toThrow(/Some error/);
    });
  });

  describe("publishTransferableRecordJob", () => {
    it("should deploy title escrow with the first transaction", async () => {
      whenTokenRegistryExist();
      const wallet = mockWallet();

      const hash = await publishTransferableRecordJob(
        {
          nonce: 1234,
          type: "TRANSFERABLE_RECORD",
          contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
          documents: [],
          merkleRoot: "9999",
          payload: {
            ownership: {
              beneficiaryAddress: "0x1111",
              holderAddress: "0x2222",
            },
          },
        },
        wallet
      );

      expect(hash).toBe("TX_HASH");
      expect(mockTxWait).toHaveBeenCalledTimes(1);
      expect(mockTokenRegistryMint).toHaveBeenCalledWith("0x1111", "0x2222", "0x9999");
    });

    it("should throw when minting transaction fails", async () => {
      whenTokenRegistryExist();
      mockTokenRegistryMint.mockRejectedValueOnce(new Error("Minting fail"));
      const wallet = mockWallet();
      await expect(
        publishTransferableRecordJob(
          {
            nonce: 1234,
            type: "TRANSFERABLE_RECORD",
            contractAddress: "0x154fcc3c953057c9527eb180cad321b906412b5d",
            documents: [],
            merkleRoot: "9999",
            payload: {
              ownership: {
                beneficiaryAddress: "0x1111",
                holderAddress: "0x2222",
              },
            },
          },
          wallet
        )
      ).rejects.toThrow(/Minting fail/);
    });
  });
});
