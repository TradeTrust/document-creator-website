# Wait for ganache to listen on 8545
sleep 2

# Using npx for the time being until all the ethers package are in sync
# If using the installed binaries, the v5 signer will not be compatible with the v4 cli

# Deploy document store to 0x63A223E025256790E88778a01f480eBA77731D04
npx @govtechsg/open-attestation-cli deploy document-store "My Document Store" -n local -k $account_key

# Deploy token registry to 0x9Eb613a88534E2939518f4ffBFE65F5969b491FF
npx @govtechsg/open-attestation-cli deploy token-registry "My Token Registry" MTR -n local -k $account_key

# Deploy title escrow creator to 0x4Bf7E4777a8D1b6EdD5F2d9b8582e2817F0B0953
npx @govtechsg/open-attestation-cli deploy title-escrow-creator "test" -n local -k $account_key