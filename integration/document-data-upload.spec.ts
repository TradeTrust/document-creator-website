import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Data upload").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const DataFileCsv = "./../src/test/fixtures/sample-data-file-csv.csv";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const FormTitleField = Selector("#root_title");
const FormRemarksField = Selector("#root_remarks");
const nextDocumentButton = Selector("[data-testid='next-document-button']");
const previousDocumentButton = Selector("[data-testid='previous-document-button']");
const fileNameField = Selector("[data-testid='file-name-input']");

test("should upload populate data fields correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("Covering Letter"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // Upload data file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileCsv]);

  // Validated the content is overwritten by the data file
  await t.expect(FormTitleField.value).eql("Testing1");
  await t.expect(FormRemarksField.value).eql("Testing1");

  // Check next document
  await t.click(nextDocumentButton);
  await t.expect(fileNameField.value).eql("Covering Letter-2");

  // Validated the content is overwritten by the data file
  await t.expect(FormTitleField.value).eql("Testing2");
  await t.expect(FormRemarksField.value).eql("Testing2");

  // Check previous document
  await t.click(previousDocumentButton);
  await t.expect(fileNameField.value).eql("Covering Letter-1");
});
