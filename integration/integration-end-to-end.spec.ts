import { ClientFunction, Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";
const DataFile = "./../src/test/fixtures/sample-data-file.json";

const Title = Selector("h1");
const Button = Selector("button");
const ButtonBack = Selector("[data-testid='back-button']");
const ButtonBackRed = Selector("[data-testid='red-back-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const AttachmentXButton = Selector("[data-testid='remove-uploaded-file-0']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const FormIdField = Selector("#root_iD");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");
const EblBeneficiaryField = Selector("[data-testid='transferable-record-beneficiary-input']");
const EblHolderField = Selector("[data-testid='transferable-record-holder-input']");
const EblNumberField = Selector("input#root_blNumber");
const previousDocumentButton = Selector("[data-testid='previous-document-button']");
const nextDocumentButton = Selector("[data-testid='next-document-button']");
const fileNameField = Selector("[data-testid='file-name-input']");
const goBack = ClientFunction(() => window.history.back());

test("Upload configuration file, choose form, fill form, submit form correctly", async (t) => {
  // Check go to doc button
  await t.click(Selector("[data-testid='config-file-docs-button']"));
  await t.expect(Title.textContent).contains("Using TradeTrust Document Creator");
  await goBack();

  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Login with Password");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // login
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

  // Test back button
  await t.click(ButtonBack);
  await t
    .expect(Selector("[data-testid='modal-title']").textContent)
    .contains("Back to form selection");
  await t.click(ButtonBackRed);
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");

  // Navigate to form and fill form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // Test data upload file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFile]);

  // Add attachment
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");

  // Remove attachment
  await t.click(AttachmentXButton);

  // Add 2 attachments
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);

  // Validated the content is overwritten by the data file
  await t.expect(FormIdField.value).eql("wfa.org.au:coo:WBC208897");
  await t.expect(FormExporterNameField.value).eql("TREASURY WINE ESTATES VINTNERS LIMITED");

  // Add new form
  await t.click(AddNewButton);

  // Navigate to form and fill form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // rename document
  await t.selectText(fileNameField);
  await t.typeText(fileNameField, "File-2");

  // go to the previous document
  await t.click(previousDocumentButton);
  await t.expect(fileNameField.value).eql("Document-1");

  // go back to the other document
  await t.click(nextDocumentButton);
  await t.expect(fileNameField.value).eql("File-2");

  // Submit
  await t.click(SubmitButton);

  // Check that download exists
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText("Document-1-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();
  await t.expect(Selector("div").withText("File-2-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();

  // Issue transferable record
  await t.click(Button.withText("Create another Document"));
  await t.click(Button.withText("Bill of Lading"));

  // Fill in form
  await t.typeText(EblBeneficiaryField, "0x6FFeD6E6591b808130a9b248fEA32101b5220eca");
  await t.typeText(EblHolderField, "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e");
  await t.typeText(EblNumberField, "MY-BL-NUMBER");

  // Submit
  await t.click(SubmitButton);

  // Check that EBL is created
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText("Document-1-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();
});
