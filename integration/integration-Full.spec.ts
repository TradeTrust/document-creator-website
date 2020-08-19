import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";
const ConfigWithError = "./../src/test/fixtures/sample-error-config.json";
const ConfigErrorFile = "./../src/test/fixtures/sample-empty-error-config.json";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";
const DataFile = "./../src/test/fixtures/sample-data-file.json";

const Title = Selector("h1");
const Button = Selector("button");
const ButtonReset = Selector("[data-testid='reset-button']");
const ButtonLogin = Selector("[data-testid='login-button']");
const ButtonBack = Selector("[data-testid='back-button']");
const PasswordField = Selector("[data-testid='password-field']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const ErrorCantReadFile = Selector("[data-testid='error-cannot-read-file']");
const ConfigError = Selector("[data-testid='config-error']");
const AttachmentXButton = Selector("[data-testid='remove-uploaded-file-0']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const FormIdField = Selector("#root_iD");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");
const EblBeneficiaryField = Selector("[data-testid='transferable-record-beneficiary-input']");
const EblHolderField = Selector("[data-testid='transferable-record-holder-input']");
const EblNumberField = Selector("input#root_blNumber");

test("Upload configuration file, choose form, fill form, preview form, submit form correctly", async (t) => {
  // upload invalid config file(without wallet)
  await t.setFilesToUpload("input[type=file]", [ConfigWithError]);
  await t.expect(ConfigError.textContent).contains("Config is malformed");

  // upload invalid file that is not a config file
  await t.setFilesToUpload("input[type=file]", [ConfigErrorFile]);
  await t.expect(ErrorCantReadFile.textContent).contains("File cannot be read");

  // upload config and reset config file
  await t.setFilesToUpload("input[type=file]", [Config]);
  await t.expect(Title.textContent).contains("Login with Password");
  await t.click(ButtonReset);
  await t.expect(Title.textContent).contains("Upload Configuration File");

  // try login without password
  await t.setFilesToUpload("input[type=file]", [Config]);
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // try login with wrong password
  await t.typeText(PasswordField, "test error");
  await t.click(ButtonLogin);
  await t.expect(PasswordFieldMsg.textContent).contains("Invalid password. Please try again.");

  // login to step 1
  await t.selectText(PasswordField);
  await t.typeText(PasswordField, "password");
  await t.click(ButtonLogin);
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

  // Submit
  await t.click(SubmitButton);

  // Check that download exists
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText("Document-1.tt").exists).ok();
  await t.expect(Selector("div").withText("Document-2.tt").exists).ok();
  await t.expect(Selector("a[download='Document-1.tt']").exists).ok();
  await t.expect(Selector("a[download='Document-2.tt']").exists).ok();

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
  await t.expect(Selector("div").withText("Document-1.tt").exists).ok();
  await t.expect(Selector("a[download='Document-1.tt']").exists).ok();
});
