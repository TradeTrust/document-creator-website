import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document preview").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const DataFile = "./../src/test/fixtures/sample-data-file-coo.json";
const Title = Selector("h1");
const Title3 = Selector("h3");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const Iframe = Selector("#iframe[title='Decentralised Rendered Certificate']");
const IframeRoot = Selector("#root");

test("should be able to preview form with data", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title3.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Upload data file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFile]);

  // Set preview mode to true
  await t.click(Selector("label.toggle-switch-label"));
  await t.switchToIframe(Iframe);

  // Check that entered data is shown
  await t.expect(IframeRoot.textContent).contains("WBC208897");

  // Check that text from template (not in data) is shown
  await t.expect(IframeRoot.textContent).contains("Place, date and signature of authorised person");
});
