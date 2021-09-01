import { Selector } from "testcafe";
import { loadConfigFile } from "./helper";

fixture("Error configs").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const ConfigWithError = "./../src/test/fixtures/sample-config-error-walletless.json";
const ConfigErrorFile = "./../src/test/fixtures/sample-config-error-empty.json";

const Title = Selector("h1");
const ButtonReset = Selector("[data-testid='reset-button']");
const ErrorCantReadFile = Selector("[data-testid='error-cannot-read-file']");
const ConfigError = Selector("[data-testid='config-error']");

test("should show correct error messages on various malformed configs", async (t) => {
  // Upload config file (without wallet)
  await loadConfigFile(ConfigWithError);
  await t.expect(ConfigError.textContent).contains("Config is malformed");

  // Upload config file (invalid config file)
  await loadConfigFile(ConfigErrorFile);
  await t.expect(ErrorCantReadFile.textContent).contains("File cannot be read");

  // Upload config file (working config file)
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");
  await t.click(ButtonReset);
  await t.expect(Title.textContent).contains("Create and Revoke Document");
  await t
    .expect(Selector("[data-testid='home-description']").textContent)
    .contains("Drag and drop your configuration file here");
});
