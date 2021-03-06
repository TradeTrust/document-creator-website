import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document rename").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";

const Title = Selector("h1");
const Button = Selector("button");
const ProgressBar = Selector("[data-testid='progress-bar']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const FormIdField = Selector("#root_iD");
const previousDocumentButton = Selector("[data-testid='previous-document-button']");
const nextDocumentButton = Selector("[data-testid='next-document-button']");
const fileNameField = Selector("[data-testid='file-name-input']");

test("should rename document filename correctly", async (t) => {
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

  // Add new form
  await t.click(AddNewButton);

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // Rename document
  await t.selectText(fileNameField);
  await t.typeText(fileNameField, "File-2");

  // Go to the previous document
  await t.click(previousDocumentButton);
  await t.expect(fileNameField.value).eql("COO-1");

  // Go back to the other document
  await t.click(nextDocumentButton);
  await t.expect(fileNameField.value).eql("File-2");
});
