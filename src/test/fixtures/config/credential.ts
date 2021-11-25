import { v2 } from "@govtechsg/open-attestation";
import { WalletOptions } from "../../../types";
import { Credential, DidCredential } from "./types";

const encryptedJsonWallet: WalletOptions = {
  type: "ENCRYPTED_JSON",
  encryptedJson:
    '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
};
const identityProof = "demo-tradetrust.openattestation.com";

export const ropstenCredential: Credential = {
  network: "ropsten",
  wallet: encryptedJsonWallet,
  tokenRegistry: "0x72d9a82203Ef9177239A5E3cB7A8FB9a78D04f17",
  documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
  identityProof: identityProof,
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-ropsten.tradetrust.io/storage",
  },
};

export const ropstenAWSCredential: Credential = {
  network: "ropsten",
  wallet: {
    type: "AWS_KMS",
    accessKeyId: "<ACCESS_KEY_ID>",
    region: "<REGION>",
    kmsKeyId: "<KMS_KEY_ID>",
  },
  tokenRegistry: "<TOKEN_REGISTRY>",
  documentStore: "<DOCUMENT_STORE>",
  identityProof: "<IDENTITY_PROOF>",
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-ropsten.tradetrust.io/storage",
  },
};

export const rinkebyCredential: Credential = {
  network: "rinkeby",
  wallet: encryptedJsonWallet,
  tokenRegistry: "0x26E730520949F9B2F73b53A35044680c2165725D",
  documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
  identityProof: identityProof,
  documentStorage: {
    apiKey: "randomKey",
    url: "https://api-rinkeby.tradetrust.io/storage",
  },
};

export const didCredential: DidCredential = {
  network: "homestead", // DID does not need network, but as we are running the config file through joi validator, we will placehold to homestead
  wallet: encryptedJsonWallet,
  didAddress: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
  identityProof: identityProof,
  revocation: {
    type: v2.RevocationType.None,
  },
};

export const localCredential: Credential = {
  network: "local",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"e0a71284ef59483795053266cb796b65e48b5124","id":"04c746c3-fbef-453a-8c63-5e915021f57a","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"0f6963939595d04cb27a4d4abe689e32"},"ciphertext":"c80c8ca9acb96cf2f87279fef71508a06d4cf166e46e06a8beecd1420f2f525f","kdf":"scrypt","kdfparams":{"salt":"bf52c3386a9235e74a075c533ec1febd6e9221b57d649a2e156775fce984a58e","n":1,"dklen":32,"p":1,"r":8},"mac":"5014d1d53e9294028eb808fbc9dd36394ebec22381946724111b9ee5ab46fd06"}}',
  },
  tokenRegistry: "0x9Eb613a88534E2939518f4ffBFE65F5969b491FF",
  documentStore: "0x63a223e025256790e88778a01f480eba77731d04",
  identityProof: identityProof,
};
