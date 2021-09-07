import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document rename").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const Button = Selector("button");
const ProgressBar = Selector("[data-testid='progress-bar']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const FormIdField = Selector("#root_iD");
const previousDocumentButton = Selector("[data-testid='previous-document-button']");
const nextDocumentButton = Selector("[data-testid='next-document-button']");
const documentNumberInput = Selector("[data-testid='document-number-input']");
const documentNameSelect = Selector("[data-testid='document-name-select'");

test("should rename document filename correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Add new form
  await t.click(AddNewButton);

  // Navigate to form
  await t.click(Button.withText("COO"));
  await t.typeText(FormIdField, "COO-ID");

  // Go to the previous document
  await t.typeText(documentNumberInput, "1", { replace: true });
  await t.expect(documentNameSelect.value).eql("1");

  // Go back to the other document
  await t.typeText(documentNumberInput, "2", { replace: true });
  await t.expect(documentNameSelect.value).eql("2");
});
