export const ropsten = {
  network: "ropsten",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  walletAWS: {
    type: "AWS_KMS",
    accessKeyId: "<access key id>",
    region: "<region>",
    kmsKeyId: "<kms key id>",
  },
  tokenRegistry: {
    name: "DEMO TOKEN REGISTRY",
    tokenRegistry: "0x72d9a82203Ef9177239A5E3cB7A8FB9a78D04f17",
    identityProof: {
      type: "DNS-TXT",
      location: "demo-tradetrust.openattestation.com",
    },
  },
  documentStore: {
    name: "DEMO DOCUMENT STORE",
    documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    identityProof: {
      type: "DNS-TXT",
      location: "demo-tradetrust.openattestation.com",
    },
  },
  documentStorageUrl: "https://api-ropsten.tradetrust.io/storage",
};

export const rinkeby = {
  network: "rinkeby",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  tokenRegistry: {
    name: "DEMO TOKEN REGISTRY",
    tokenRegistry: "0x26E730520949F9B2F73b53A35044680c2165725D",
    identityProof: {
      type: "DNS-TXT",
      location: "demo-tradetrust.openattestation.com",
    },
  },
  documentStore: {
    name: "DEMO DOCUMENT STORE",
    documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
    identityProof: {
      type: "DNS-TXT",
      location: "demo-tradetrust.openattestation.com",
    },
  },
  documentStorageUrl: "https://api-rinkeby.tradetrust.io/storage",
};

export const did = {
  network: "homestead",
  wallet: {
    type: "ENCRYPTED_JSON",
    encryptedJson:
      '{"address":"1245e5b64d785b25057f7438f715f4aa5d965733","id":"bf069d1b-4e88-487c-b695-f2e03ed7c1ff","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"1f34e7bfdaee4b0778ecea4c8d12a543"},"ciphertext":"4f6cee88b4776f4f6f8eedf3da11c6a13542aa4bb65d46a5c1bc44c100a96f54","kdf":"scrypt","kdfparams":{"salt":"d931e0ea13032fd70060e40054c5a76c0571f4d840ec91eeda1bf68bdcad84db","n":1,"dklen":32,"p":1,"r":8},"mac":"06c7897e3ff04245bf4f0765d8b6a8482c1c9981cb46ae88f636f9c83cd0b891"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-05-15T09-03-13.0Z--1245e5b64d785b25057f7438f715f4aa5d965733","mnemonicCounter":"99b7f5b6897dcfe22fc7aa00d8e3cf5e","mnemonicCiphertext":"6e7c1d38f162e54050b125f1f51b43ca","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}',
  },
  issuer: {
    id: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733",
    name: "DEMO DID",
    revocation: {
      type: "NONE",
    },
    identityProof: {
      type: "DNS-DID",
      key: "did:ethr:0x1245e5b64d785b25057f7438f715f4aa5d965733#controller",
      location: "demo-tradetrust.openattestation.com",
    },
  },
};
