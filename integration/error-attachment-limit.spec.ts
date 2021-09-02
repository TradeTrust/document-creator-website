import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Error attachment limit").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const AttachmentSampleThatIs6Mb = "./../src/test/fixtures/sample-file-6MB.pdf";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";

const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const Button = Selector("button");
const FormIdField = Selector("#root_iD");
const ProgressBar = Selector("[data-testid='progress-bar']");
const FileSizeError = Selector("[data-testid='file-size-error']");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");

test("should show file limit warning when over 6mb", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // Upload a attachment (over file limit)
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSampleThatIs6Mb]);
  await t.expect(FileSizeError.textContent).contains("Error: Total attachment file size exceeds 5MB");

  // Upload a attachment (below file limit)
  await t.setFilesToUpload("input[data-testid=attachment-file-drop-zone]", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");
});
