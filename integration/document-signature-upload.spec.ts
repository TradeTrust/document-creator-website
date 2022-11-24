import { Selector } from "testcafe";
import { enterPassword, loadConfigFile, configLocal } from "./helper";

fixture("Document signature upload").page`http://localhost:3000`;

const Button = Selector("button");
const SignatureWidget = Selector("[data-testid='custom-file-widget-thumbnail']");
const SignatureInput = Selector("input#root_firstSignatoryAuthentication_signature");
const sampleSignature = "./../src/test/fixtures/signature.jpg";

test("should be uploaded correctly", async (t) => {
  await loadConfigFile(configLocal);
  await enterPassword("password");
  await t.click(Button.withText("TradeTrust ChAFTA Certificate of Origin v2"));

  await t.setFilesToUpload(SignatureInput, [sampleSignature]);
  await t.expect(SignatureWidget.textContent).contains("signature.jpg");
});
