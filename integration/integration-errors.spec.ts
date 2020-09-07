import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";
const AttachmentSampleThatIs6Mb = "./../src/test/fixtures/sample-file-6MB.pdf";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";

const Title = Selector("h1");
const Button = Selector("button");
const FormIdField = Selector("#root_iD");
const ButtonLogin = Selector("[data-testid='login-button']");
const PasswordField = Selector("[data-testid='password-field']");
const PasswordFieldMsg = Selector("[data-testid='password-field-msg']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const FileSizeError = Selector("[data-testid='file-size-error']");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");

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

  // select a form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // upload a file that is greater than 5MB and expect an error
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [
    AttachmentSampleThatIs6Mb,
  ]);
  await t
    .expect(FileSizeError.textContent)
    .contains("Error: Total attachment file size exceeds 5MB");

  // upload a proper file and the error is gone
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");
});
