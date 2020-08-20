import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";

const Title = Selector("h1");
const ButtonLogin = Selector("[data-testid='login-button']");
const PasswordField = Selector("[data-testid='password-field']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("Upload configuration file and test password field to handle correctly", async (t) => {
  // load config
  await loadConfigFile(Config);

  //try login without password
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // try login with wrong password
  await enterPassword("test error");
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // login again with the correct password
  await t.selectText(PasswordField);
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");
});
