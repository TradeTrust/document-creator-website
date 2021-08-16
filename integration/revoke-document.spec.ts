import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";
import { homedir } from "os";
import { join } from "path";

fixture("Revoke flow").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const Title = Selector("h1");
const Button = Selector("button");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const DownloadLink = Selector("[data-testid='download-file-button']");

function getFileDownloadPath(fileName: string): string {
  return join(homedir(), "Downloads", fileName);
}

test("should revoke a document on local blockchain correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Issue and download document
  await t.click(Button.withText("Covering Letter (DBS)"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.click(SubmitButton);
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.click(DownloadLink.nth(0));
  const filePath = getFileDownloadPath("Covering Letter (DBS)-1-local.tt");

  // Change to revoke
  await t.click(Selector("[data-testid='form-logout-button']"));
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");
  await t.click(Selector("[data-testid='choose-revoke-button']"));
  await t.expect(Title.textContent).contains("Revoke Document");

  // Upload a file
  await t.setFilesToUpload("input[type=file][data-testid=revoke-document-drop-zone]", [filePath]);

  // Click back button to test back flow and upload file again
  await t.click(Selector("[data-testid='back-revoke-button']"));
  await t.expect(Title.textContent).contains("Revoke Document");
  await t.setFilesToUpload("input[type=file][data-testid=revoke-document-drop-zone]", [filePath]);

  // Revoke Document
  await t.click(Selector("[data-testid='revoke-button']"));
  await t.expect(Selector("[data-testid='modal-title']").textContent).contains("Revoke Document");
  await t.click(Selector("[data-testid='modal-revoke-button']"));
  await t.expect(Title.textContent).contains("Document(s) revoked successfully");
  await t.expect(Selector("[data-testid='file-name']").textContent).contains("Covering Letter (DBS)-1-local.tt");
});
