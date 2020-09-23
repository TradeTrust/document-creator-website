account_key=0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7

# Wait for ganache to listen on 8545
sleep 2

# Deploy document store to 0x63A223E025256790E88778a01f480eBA77731D04
./node_modules/@govtechsg/open-attestation-cli/dist/cjs/index.js deploy document-store "My Document Store" -n local -k $account_key

# Deploy token registry to 0x9Eb613a88534E2939518f4ffBFE65F5969b491FF
./node_modules/@govtechsg/open-attestation-cli/dist/cjs/index.js deploy token-registry "My Token Registry" MTR -n local -k $account_key

# Deploy title escrow creator to 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953
./node_modules/@govtechsg/open-attestation-cli/dist/cjs/index.js deploy title-escrow-creator "test" -n local -k $account_key

npm run integration:internal:single $1