import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config.json";
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

const FormIdField = Selector("#root_iD");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormExporterNameField = Selector("#root_supplyChainConsignment_exporter_name");

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
  
  // // Remove attachment
  await t.click(AttachmentXButton);
  // await t.expect(FormAttachmentField).notOk;
  
  // Add attachment again
  // await t.wait(20000)
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");

  // Validated the content is overwritten by the data file
  await t.expect(FormIdField.value).eql("wfa.org.au:coo:WBC208897");
  await t.expect(FormExporterNameField.value).eql("TREASURY WINE ESTATES VINTNERS LIMITED");

  // preview form
  // submit form (probably can spin up a test net here)
});
