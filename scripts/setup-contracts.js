const shell = require("shelljs");

const ACCOUNT_KEY = "0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7";

// Deploy document store to 0x63A223E025256790E88778a01f480eBA77731D04
shell.exec(`oa deploy document-store "My Document Store" -n local -k ${ACCOUNT_KEY}`);

// Deploy token registry to 0x9Eb613a88534E2939518f4ffBFE65F5969b491FF
shell.exec(`oa deploy token-registry "My Token Registry" MTR -n local -k ${ACCOUNT_KEY}`);

// Deploy title escrow creator to 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953
shell.exec(`oa deploy title-escrow-creator "test" -n local -k ${ACCOUNT_KEY}`);
