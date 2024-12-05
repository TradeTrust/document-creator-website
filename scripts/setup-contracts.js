const shell = require("shelljs");

const ACCOUNT_KEY = "0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7";
const DOCUMENT_STORE_ADDRESS = "0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953";

const CLI_PATH = "tradetrust";

const TITLE_ESCROW_FACTORY_ADDRESS = "0x63A223E025256790E88778a01f480eBA77731D04";

// Need to deploy as it will use the 1st contract address: 0x63a223e025256790e88778a01f480eba77731d04
shell.exec(`${CLI_PATH} deploy title-escrow-factory -n local -k ${ACCOUNT_KEY}`);

// Need to deploy as it will use the 2nd contract address: 0x9Eb613a88534E2939518f4ffBFE65F5969b491FF
shell.exec(
  `${CLI_PATH} deploy token-registry "DEMO TOKEN REGISTRY" DTR -n local -k ${ACCOUNT_KEY} --factory-address ${TITLE_ESCROW_FACTORY_ADDRESS} --standalone`
);

// Need to deploy as it will use the 3rd contract address: 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953 (This align with the DNS-TXT and Document)
shell.exec(`${CLI_PATH} deploy document-store "My Document Store" -n local -k ${ACCOUNT_KEY}`);

const merkleRootToIssue = [
  // wrapped-document-local-revokable.json
  "0xbc4f35f03982a760505785d62565e29b88377db1243b273bd598e4763bacb83c",
];

// Issue a verifiable document for revoke flow
merkleRootToIssue.forEach((hash) => {
  shell.exec(
    `${CLI_PATH} document-store issue --address ${DOCUMENT_STORE_ADDRESS} --hash ${hash} -n local -k ${ACCOUNT_KEY}`
  );
});
