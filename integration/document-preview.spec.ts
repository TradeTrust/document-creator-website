import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";
const DataFile = "./../src/test/fixtures/sample-data-file.json";
const Title = Selector("h1");
const Button = Selector("button");
const PasswordField = Selector("[data-testid='password-field']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const Iframe = Selector("#iframe[title='Decentralised Rendered Certificate']");
const IframeRoot = Selector("#root");

test("Preview form with data", async (t) => {
  // upload config and reset config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Login with Password");

  // login to step 1
  await t.selectText(PasswordField);
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFile]);

  // Set preview mode to true
  await t.click(Selector("label.toggle-switch-label"));
  await t.switchToIframe(Iframe);

  // Check that entered data is shown
  await t.expect(IframeRoot.textContent).contains("WBC208897");

  // Check that text from template (not in data) is shown
  await t.expect(IframeRoot.textContent).contains("Place, date and signature of authorised person");
});
