import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config.json";
const ConfigWithError = "./../src/test/fixtures/sample-error-config.json";
const ConfigErrorFile = "./../src/test/fixtures/sample-empty-error-config.json";
const Title = Selector("h1");
// const Button = Selector("button");
// const ButtonReset = Selector("[data-testid='reset-button']");
const ButtonLogin = Selector("[data-testid='login-button']");
// const ButtonBack = Selector("[data-testid='back-button']");
const PasswordField = Selector("[data-testid='password-field']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
// const ProgressBar = Selector("[data-testid='progress-bar']");
const ErrorCantReadFile = Selector("[data-testid='error-cannot-read-file']");
const ConfigError = Selector("[data-testid='config-error']");

test("Upload invalid config file(without wallet)", async (t) => {
  // upload config file with error
  await t.setFilesToUpload("input[type=file]", [ConfigWithError]);
  await t.expect(ConfigError.textContent).contains("Config is malformed");
});

test("Upload invalid file that is not a config file", async (t) => {
  // upload file
  await t.setFilesToUpload("input[type=file]", [ConfigErrorFile]);
  await t.expect(ErrorCantReadFile.textContent).contains("File cannot be read");
});

test("Upload valid config file and input wrong password", async (t) => {
  // upload file
  await t.setFilesToUpload("input[type=file]", [Config]);
  await t.expect(Title.textContent).contains("Login with Password");
  await t.typeText(PasswordField, "test error");
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");
});
