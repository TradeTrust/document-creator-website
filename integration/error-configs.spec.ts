import { Selector } from "testcafe";
import { loadConfigFile, configLocal, configLocalWalletless, configLocalEmpty } from "./helper";

fixture("Error configs").page`http://localhost:3000`;

const ConfigDropzoneTitle = Selector("[data-testid='config-dropzone-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const ButtonReset = Selector("[data-testid='reset-button']");
const ErrorCantReadFile = Selector("[data-testid='error-cannot-read-file']");
const ConfigError = Selector("[data-testid='files-error']");

test("should show correct error messages on various malformed configs", async (t) => {
  // Upload config file (without wallet)
  await loadConfigFile(configLocalWalletless);
  await t.expect(ConfigError.textContent).contains("Config is malformed");

  // Upload config file (invalid config file)
  await loadConfigFile(configLocalEmpty);
  await t.expect(ErrorCantReadFile.textContent).contains("Document cannot be read");

  // Upload config file (working config file)
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");
  await t.click(ButtonReset);
  await t.expect(ConfigDropzoneTitle.textContent).contains("Create and Revoke Document");
  await t
    .expect(Selector("[data-testid='home-description']").textContent)
    .contains("Drag and drop your configuration file here");
});
