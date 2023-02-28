const shell = require("shelljs");

const ACCOUNT_KEY = "0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7";

// Deploy document store to 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953
shell.exec(`oa deploy document-store "My Document Store" -n local -k ${ACCOUNT_KEY}`);

// Deployed token registry at 0xf18CD26780B6D3589371fb0b3fE8E2a513D6Fdc6 on Goerli
// shell.exec(`oa deploy token-registry "My Token Registry" MTR -n local -k ${ACCOUNT_KEY}`);

// Issue a verifiable document for revoke flow
shell.exec(
  `oa document-store issue --address 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953 --hash 0xc9ea7d07be304e393e21f3b67f9e9f96b6bd829aab287af473b1d4f0924cbb81  -n local -k ${ACCOUNT_KEY}`
);
