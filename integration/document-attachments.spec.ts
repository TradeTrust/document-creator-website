import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document attachments").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";
const DataFileCoo = "./../src/test/fixtures/sample-data-file-coo.json";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const AttachmentXButton = Selector("[data-testid='remove-uploaded-file-0']");
const FormIdField = Selector("#root_iD");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");
const Attachments = Selector("[data-testid*='upload-file-']");

test("should be added and removed correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // Validate that default values is populated
  await t
    .expect(Selector("#root_supplyChainConsignment_loadingBaseportLocation_iD").value)
    .contains("DEFAULT_BASEPORT_ID");
  await t
    .expect(Selector("#root_supplyChainConsignment_loadingBaseportLocation_name").value)
    .contains("DEFAULT_BASEPORT_LOCATION");

  // Fill form
  await t.typeText(FormIdField, "COO-ID");
  await t.expect(FormIdField.value).eql("COO-ID");

  // Test data upload file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileCoo]);

  // Validated the content is overwritten by the data file
  await t.expect(FormIdField.value).eql("wfa.org.au:coo:WBC208897");
  await t.expect(FormExporterNameField.value).eql("TREASURY WINE ESTATES VINTNERS LIMITED");

  // Add attachment
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");
  await t.expect(Attachments.count).eql(1);

  // Remove attachment
  await t.click(AttachmentXButton);

  // Add 2 attachments
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(Attachments.count).eql(2);
});
