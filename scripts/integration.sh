function cleanup {
  TEST_SIGNAL=$?
  # kills all subprocess of this process
  pkill -P $$
  exit $TEST_SIGNAL
}

# Any interrupt signal to cause exit to be fired
trap exit INT TERM ERR
# Cleanup the process when the process exit
trap cleanup EXIT

# Exit when anything fail
set -e

# Setup local blockchain on the background
node_modules/ganache-cli/cli.js --mnemonic "indicate swing place chair flight used hammer soon photo region volume shuffle" &

# Setup contracts
account_key=0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7 ./scripts/deploy.sh

# Run integration test
if [  -z "$HEADLESS" ]
then
    npm run integration:internal
else
    npm run integration:internal:headless
fi