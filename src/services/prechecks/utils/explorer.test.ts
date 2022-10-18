import axios from "axios";
import { getNetworkDetails } from "../../../common/utils";
import { Network } from "../../../types";
import { getCreationAddress, getCreationAddressRequest } from "./explorer";

jest.mock("axios", () => jest.fn());
const mockAxios = axios as any as jest.Mock;

const mockEtherscanSuccessResponse = {
  data: {
    status: "1",
    message: "OK",
    result: [
      {
        blockNumber: "10206141",
        timeStamp: "1620630686",
        hash: "0xd4d9fcf112687f9b2998b4568af73ecb2ef8566fda67f83db4e0b850a398edc7",
        nonce: "1847",
        blockHash: "0x7d3745c26342777fc14abb45fcab3548f819f2c12601f5b1c8feb8301353c652",
        transactionIndex: "0",
        from: "0x1245e5b64d785b25057f7438f715f4aa5d965733",
        to: "",
        value: "0",
        gas: "3540814",
        gasPrice: "1000000000",
        isError: "0",
        txreceipt_status: "1",
        input: "<Truncated>",
        contractAddress: "0x72d9a82203ef9177239a5e3cb7a8fb9a78d04f17",
        cumulativeGasUsed: "3540814",
        gasUsed: "3540814",
        confirmations: "1877968",
      },
    ],
  },
};

const mockEtherscanFailResponse = { status: "0", message: "No transactions found", result: [] };

describe("explorer", () => {
  describe("getCreationAddressRequest", () => {
    it("should call axios with valid parameters", async () => {
      mockAxios.mockReturnValue(true);
      const contractAddress = "0xC0NTRACTADDRESS";
      const networkDetails = getNetworkDetails("goerli" as Network);
      const apiKey = "APIKEY-FOR-TEST";
      const response = await getCreationAddressRequest(contractAddress, networkDetails, apiKey);
      expect(response).toBe(true);
      expect(mockAxios).toHaveBeenCalledWith({
        method: "get",
        url: `https://api-goerli.etherscan.io/api`,
        headers: { "Content-Type": "application/json" },
        params: {
          action: "txlist",
          address: contractAddress,
          apikey: apiKey,
          endblock: "99999999",
          module: "account",
          offset: "1",
          page: "1",
          sort: "asc",
          startblock: "0",
        },
      });
    });
  });

  describe("getCreationAddress", () => {
    it("should return undefined on a bad case", async () => {
      mockAxios.mockReturnValue(mockEtherscanFailResponse);
      const contractAddress = "0xC0NTRACTADDRESS";
      const networkDetails = getNetworkDetails("goerli" as Network);
      const apiKey = "APIKEY-FOR-TEST";
      const response = await getCreationAddress(contractAddress, networkDetails, apiKey);
      expect(response).toBe(undefined);
    });

    it("should return owner address on a good case", async () => {
      mockAxios.mockReturnValue(mockEtherscanSuccessResponse);
      const contractAddress = "0xC0NTRACTADDRESS";
      const networkDetails = getNetworkDetails("goerli" as Network);
      const apiKey = "APIKEY-FOR-TEST";
      const response = await getCreationAddress(contractAddress, networkDetails, apiKey);
      expect(response).toBe("0x1245e5b64d785b25057f7438f715f4aa5d965733");
    });
  });
});
