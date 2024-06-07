import { Selector } from "testcafe";

const LoadDemoConfigFileBtn = Selector("[data-testid='load-demo-config-button']");
const FillFormTitle = Selector("[data-testid='fill-form-title']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const EblBeneficiaryField = Selector("[data-testid='transferable-record-beneficiary-input']");
const EblHolderField = Selector("[data-testid='transferable-record-holder-input']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const EblNumberField = Selector("input#root_blNumber");
const EblScacField = Selector("input#root_scac");
const ProcessTitle = Selector('[data-testid="process-title"]');
const IssuedFileName = Selector('[data-testid="file-name"]');
const DocumentDownloadBtn = Selector('[data-testid="download-file-button"]');
const ProcessAnotherDocBtn = Selector('[data-testid="process-another-document-button"]');

fixture("Demo Config File").page(`http://localhost:3000`);
const Button = Selector("button");

test("can able to load demo config file and issue example documents", async (t) => {
  // ################ 1. Load Demo Config
  // load demo config file
  await t.click(LoadDemoConfigFileBtn);
  await t.expect(ProgressBar.textContent).contains("1");

  // ################ 2. Issue Bill of Lading Document
  // select Bill of Laiding Document
  await t.click(Button.withText("TradeTrust Bill of Lading v2 (Carrier)"));
  await t.expect(FillFormTitle.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // fill the form
  await t.typeText(EblBeneficiaryField, "0xF11e3850F0bb8C72925c329EC446a2026cd4bB94");
  await t.typeText(EblHolderField, "0xF11e3850F0bb8C72925c329EC446a2026cd4bB94");
  await t.typeText(EblNumberField, "MY-BL-NUMBER");
  await t.typeText(EblScacField, "My-EBL-SCAC");
  // submit form
  await t.click(SubmitButton);

  // check if bill of lading is created
  await t.expect(ProcessTitle.innerText).eql("Document(s) issued successfully", { timeout: 20000 }); // cater for file issue delay
  await t.expect(IssuedFileName.textContent).contains("TradeTrust-Bill-of-Lading-v2-(Carrier)-1-stability.tt");
  await t.expect(DocumentDownloadBtn.exists).ok("Download button for document doesn't exist");

  // ################ 3. Issue ChAFTA Certificate of Origin
  await t.click(ProcessAnotherDocBtn);
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v2"));
  await t.click(SubmitButton);
  await t.expect(ProcessTitle.innerText).eql("Document(s) issued successfully", { timeout: 20000 }); // cater for file issuance delay
  await t.expect(IssuedFileName.textContent).contains("TradeTrust-ChAFTA-Certificate-of-Origin-v2-1-stability.tt");
  await t.expect(DocumentDownloadBtn.exists).ok("Download button for document doesn't exist");

  // ################ 4. Issue TradeTrust Invoice DNS-DID
  await t.click(ProcessAnotherDocBtn);
  await t.click(Button.withText("TradeTrust Invoice v2 (DNS-DID)"));
  await t.click(SubmitButton);
  await t.expect(ProcessTitle.innerText).eql("Document(s) issued successfully", { timeout: 20000 }); // cater for file issuance delay
  await t.expect(IssuedFileName.textContent).contains("TradeTrust-Invoice-v2-(DNS-DID)-1-stability.tt");
  await t.expect(DocumentDownloadBtn.exists).ok("Download button for document doesn't exist");
});
