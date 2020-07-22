trap "exit" INT TERM ERR
trap "kill 0" EXIT

# Setup local blockchain on the background
node_modules/ganache-cli/cli.js --mnemonic "indicate swing place chair flight used hammer soon photo region volume shuffle" &

# Setup contracts
account_key=0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7 ./scripts/deploy.sh

# Run integration test
[  -z "$HEADLESS" ] && npm run integration:internal || npm run integration:internal:headless