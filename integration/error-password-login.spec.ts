import { Selector } from "testcafe";
import { enterPassword, deletePassword, loadConfigFile } from "./helper";

fixture("Error password login").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";

const Title = Selector("h1");
const ButtonLogin = Selector("[data-testid='login-button']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should handle no password, wrong password errors correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login (no password)
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // Login (wrong password)
  await enterPassword("test error");
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // Login (correct password)
  await deletePassword();
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");
});
