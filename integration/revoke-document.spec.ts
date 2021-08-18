import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Revoke flow").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const revokableDocument = "./../src/test/fixtures/wrapped-document-local-revokable.json";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should revoke a document on local blockchain correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Go to Revoke document page
  await t.click(Selector("[data-testid='choose-revoke-button']"));
  await t.expect(Title.textContent).contains("Revoke Document");

  // Upload a file
  await t.setFilesToUpload("input[type=file][data-testid=revoke-document-drop-zone]", [revokableDocument]);

  // Click back button to test back flow and upload file again
  await t.click(Selector("[data-testid='back-revoke-button']"));
  await t.expect(Title.textContent).contains("Revoke Document");
  await t.setFilesToUpload("input[type=file][data-testid=revoke-document-drop-zone]", [revokableDocument]);

  // Revoke Document
  await t.click(Selector("[data-testid='revoke-button']"));
  await t.expect(Selector("[data-testid='modal-title']").textContent).contains("Revoke Document");
  await t.click(Selector("[data-testid='modal-revoke-button']"));
  await t.expect(Title.textContent).contains("Document(s) revoked successfully");
  await t.expect(Selector("[data-testid='file-name']").textContent).contains("wrapped-document-local-revokable.json");
});
