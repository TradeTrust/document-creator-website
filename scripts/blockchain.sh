# Allow jobs control
set -m

# Setup local blockchain on the background
node_modules/ganache-cli/cli.js --mnemonic "indicate swing place chair flight used hammer soon photo region volume shuffle" &

# Setup contracts
account_key=0xe82294532bcfcd8e0763ee5cef194f36f00396be59b94fb418f5f8d83140d9a7 ./scripts/deploy.sh

# Bring ganache to the foreground again
[  -z "$SKIP_FOREGROUND" ] && fg %1