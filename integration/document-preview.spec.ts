import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal, dataFileJsonCoo } from "./helper";

fixture("Document preview").page`http://localhost:3000`;

const FillFormTitle = Selector("[data-testid='fill-form-title']");
const WalletDecryptionTitle = Selector("[data-testid='wallet-decryption-title']");
const FormSelectionTitle = Selector("[data-testid='form-selection-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const FormIdField = Selector("#root_iD");
const PreviewToggle = Selector("[data-testid='toggle-switch-label']");
const DocumentPreview = Selector("[data-testid='document-preview']");
const ConnectionTimeout = Selector("h3").withText("Connection timeout on renderer");

const Button = Selector("button");
const Iframe = Selector("#iframe[title='Decentralised Rendered Certificate']");
const DataFileDropZoneInput = Selector("[data-testid='data-file-dropzone'] input");

const uploadedDocumentId = "wfa.org.au:coo:WBC208897";

test("should be able to preview form with data", async (t) => {
  // Upload config file
  await loadConfigFile(configLocal);
  await t.expect(WalletDecryptionTitle.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(FormSelectionTitle.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v2"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Upload data file and wait until the form is populated before previewing
  await t.setFilesToUpload(DataFileDropZoneInput, [dataFileJsonCoo]);
  await t.expect(FormIdField.value).eql(uploadedDocumentId, { timeout: 15000 });

  // Preview mode mounts DocumentPreview with the uploaded document and the renderer iframe.
  // Do not assert iframe inner text: TestCafe's proxy + Chrome 153+ can leave
  // cross-origin generic-templates #root empty even after penpal connects.
  await t.click(PreviewToggle);
  await t.expect(FormIdField.exists).notOk({ timeout: 5000 });
  // Uploaded document reached DocumentPreview (parent-observable, not iframe contents)
  await t.expect(DocumentPreview.getAttribute("data-document-id")).eql(uploadedDocumentId, { timeout: 5000 });
  await t.expect(Iframe.exists).ok({ timeout: 15000 });
  await t.expect(Iframe.getAttribute("src")).contains("https://generic-templates.tradetrust.io");
  // Positive connection result: FrameConnector onConnected (penpal deadline is 30s).
  // Only then is an absent ConnectionTimeout meaningful.
  await t.expect(DocumentPreview.getAttribute("data-frame-connected")).eql("true", { timeout: 45000 });
  await t.expect(ConnectionTimeout.exists).notOk();

  // Round-trip: leave preview and confirm the uploaded document is still bound to the form
  await t.click(PreviewToggle);
  await t.expect(FormIdField.value).eql(uploadedDocumentId, { timeout: 5000 });
});
