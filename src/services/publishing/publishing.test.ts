import {} from "./index";

describe("getTitleEscrowCreator", () => {
  it.todo(
    "should return instance of TitleEscrowCreator for a network with deployed creator contract"
  );
  it.todo("should throw on network without creator contract");
});

describe("publishVerifiableDocumentJob", () => {
  it.todo("should return transaction hash when publishing succeed");
  it.todo("should throw when transaction fails");
});

describe("publishTransferableRecordJob", () => {
  it.todo("should deploy title escrow with the first transaction");
  it.todo("should mint token with the second transaction");
  it.todo("should return the transaction hash when publishing succeed");
  it.todo("should throw when deployment transaction fails");
  it.todo("should throw when minting transaction fails");
});
