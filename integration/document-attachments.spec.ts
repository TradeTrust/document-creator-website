import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document attachments").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const AttachmentSample = "./../src/test/fixtures/sample.pdf";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const AttachmentXButton = Selector("[data-testid='remove-uploaded-file-0']");
const FormAttachmentField = Selector("[data-testid='upload-file-0']");
const FormAttachmentFields = Selector("[data-testid*='upload-file-']");

test("should be added and removed correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("Covering Letter"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Add attachment
  await t.setFilesToUpload("input[data-testid='attachment-file-drop-zone']", [AttachmentSample]);
  await t.expect(FormAttachmentField.textContent).contains("sample.pdf");
  await t.expect(FormAttachmentFields.count).eql(1);

  // Remove attachment
  await t.click(AttachmentXButton);
});
