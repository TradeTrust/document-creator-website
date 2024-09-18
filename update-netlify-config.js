const fs = require('fs');
const path = require('path');

// Read environment variables
const nonceValue = process.env.REACT_APP_NONCE_VALUE || '';

// Path to netlify.toml
const netlifyTomlPath = path.resolve(__dirname, 'netlify.toml');

// Read existing netlify.toml
fs.readFile(netlifyTomlPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading netlify.toml:', err);
    return;
  }

  // Replace placeholder with the actual nonce value
  const updatedData = data.replace(/{nonce}/g, nonceValue);

  // Write updated netlify.toml
  fs.writeFile(netlifyTomlPath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing updated netlify.toml:', err);
    }
  });
});
