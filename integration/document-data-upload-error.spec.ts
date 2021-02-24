import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Data upload error").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const DataFileEblError = "./../src/test/fixtures/sample-data-file-ebl-error-missing-fields.json";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const ErrorItem1 = Selector("[data-testid='form-error-banner'] li").nth(0);
const ErrorItem2 = Selector("[data-testid='form-error-banner'] li").nth(1);

test("should show validation error messages correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("Bill of Lading"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // Upload data file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [
    DataFileEblError,
  ]);

  // Assert validation error messages
  await t.expect(ErrorItem1.textContent).contains("should have required property 'blNumber'");
  await t.expect(ErrorItem2.textContent).contains("should have required property 'scac'");
});
