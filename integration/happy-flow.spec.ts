import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Happy flow").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const DataFileCoo = "./../src/test/fixtures/sample-data-file-coo.json";
const DataFileEbl = "./../src/test/fixtures/sample-data-file-ebl.json";
const DataFileCsvEbl = "./../src/test/fixtures/sample-data-file-ebl.csv";

const Title = Selector("h1");
const Button = Selector("button");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const NextDocumentButton = Selector("[data-testid='next-document-button']");
const DownloadAllButton = Selector("[data-testid='download-all-button']");
const FormIdField = Selector("#root_iD");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");
const EblBeneficiaryField = Selector("[data-testid='transferable-record-beneficiary-input']");
const EblHolderField = Selector("[data-testid='transferable-record-holder-input']");
const EblNumberField = Selector("input#root_blNumber");
const EblFileNameField = Selector("[data-testid='file-name-input']");

test("should issue the documents on local blockchain correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

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
  await t.typeText(FormIdField, "COO-ID");

  // Upload data file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileCoo]);

  // Validated the content is overwritten by the data file
  await t.expect(FormIdField.value).eql("wfa.org.au:coo:WBC208897");
  await t.expect(FormExporterNameField.value).eql("TREASURY WINE ESTATES VINTNERS LIMITED");

  // Submit
  await t.click(SubmitButton);

  // Pending confirmation of issued documents
  await t.expect(Selector("[data-testid='publish-loader']").exists).ok();

  // Check that download exists
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText("COO-1-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();
  await t.expect(DownloadAllButton.exists).ok();

  // Issue transferable record
  await t.click(Button.withText("Create another Document"));
  await t.click(Button.withText("Bill of Lading"));

  // Fill in form
  await t.typeText(EblBeneficiaryField, "0x6FFeD6E6591b808130a9b248fEA32101b5220eca");
  await t.typeText(EblHolderField, "0x8e87c7cEc2D4464119C937bfef3398ebb1d9452e");
  await t.typeText(EblNumberField, "MY-BL-NUMBER");

  // Test data upload json file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileEbl]);

  // Validate the content is overwritten by the data file
  await t.expect(EblFileNameField.value).eql("bill-123");
  await t.expect(EblBeneficiaryField.value).eql("0xa61b056da0084a5f391ec137583073096880c2e3");
  await t.expect(EblHolderField.value).eql("0xa61b056da0084a5f391ec137583073096880c2e3");
  await t.expect(EblNumberField.value).eql("123");

  // Test data upload csv file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileCsvEbl]);

  // Validate the content is overwritten by the data file
  await t.expect(EblFileNameField.value).eql("bill-<blNumber 1>");
  await t.expect(EblBeneficiaryField.value).eql("<beneficiary address 1>");
  await t.expect(EblHolderField.value).eql("<holder address 1>");
  await t.expect(EblNumberField.value).eql("<blNumber 1>");

  await t.click(NextDocumentButton);
  await t.expect(EblFileNameField.value).eql("bill-<blNumber 2>");
  await t.expect(EblBeneficiaryField.value).eql("<beneficiary address 2>");
  await t.expect(EblHolderField.value).eql("<holder address 2>");
  await t.expect(EblNumberField.value).eql("<blNumber 2>");

  // Submit
  await t.click(SubmitButton);

  // Check that EBL is created
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText("bill-123-local.tt").exists).ok();
  await t.expect(Selector("div").withText("bill-<blNumber 1>-local.tt").exists).ok();
  await t.expect(Selector("div").withText("bill-<blNumber 2>-local.tt").exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();
});
