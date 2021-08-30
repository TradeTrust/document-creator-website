import { existsSync, readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("uiSchema").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";

const Title = Selector("h1");
const processTitle = Selector("[data-testid='process-title']");
const Button = Selector("button");
const Form = Selector("[data-testid='form-group field field-object']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const DocumentTitleField = Selector("#root_title");
const DocumentRemarksField = Selector("#root_remarks");
const DownloadLink = Selector("[data-testid='download-file-button']");

function getFileDownloadPath(fileName: string): string {
  return join(homedir(), "Downloads", fileName);
}

// From https://stackoverflow.com/a/57624660/950462
const waitForFileDownload = async (t: TestController, filePath: string): Promise<boolean> => {
  // Timeout after 10 seconds
  for (let i = 0; i < 100; i++) {
    if (existsSync(filePath)) return true;
    await t.wait(100);
  }
  return existsSync(filePath);
};

test("form should render correctly according to uiSchema", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // login
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("Covering Letter (DBS)"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Validate that default values is populated
  await t.expect(DocumentTitleField.value).contains("Documents Bundle");
  await t.expect(DocumentRemarksField.value).contains("Some very important documents in here for some submission");

  // Expect uiSchema to be working, i.e. it renders the remarks field to be a textarea
  await t
    .expect(Form.find("textarea#root_remarks").value)
    .contains("Some very important documents in here for some submission");

  // Add new form
  await t.click(AddNewButton);

  /*
   * This test case is here in the event that users really
   * want to have a `uiSchema` attribute present in their
   * TradeTrust document.
   */

  // Navigate to form
  await t.click(Button.withText("Covering Letter (DBS, Nested UISchema)"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("2");

  // Validate that default values is populated
  await t.expect(DocumentTitleField.value).contains("Documents Bundle");
  await t.expect(DocumentRemarksField.value).contains("Some very important documents in here for some submission");

  // Expect remarks field to be a normal input field (because uiSchema does not exist at the form template's root level)
  await t
    .expect(Form.find("input#root_remarks").value)
    .contains("Some very important documents in here for some submission");

  // Submit
  await t.click(SubmitButton);

  // pending confirmation of issued documents
  await t.expect(Selector("[data-testid='processing-loader']").exists).ok();

  // Check that the two Covering Letters are created
  const fileName1 = "Covering Letter (DBS)-1-local.tt";
  const fileName2 = "Covering Letter (DBS, Nested UISchema)-2-local.tt";
  await t.expect(processTitle.withText("Document(s) issued successfully").exists).ok();
  await t.expect(Selector("div").withText(fileName1).exists).ok();
  await t.expect(Selector("div").withText(fileName2).exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();

  // Check that the first Covering Letter has been downloaded successfully
  await t.click(DownloadLink.nth(0));
  const filePath1 = getFileDownloadPath(fileName1);
  await t.expect(await waitForFileDownload(t, filePath1)).eql(true);

  // We expect the contents of the first doc to NOT contain uiSchema key
  // Only doing a `contains` check because the value is non-deterministic due to the hash
  const docContents1 = JSON.parse(readFileSync(filePath1, "utf8"));
  await t.expect(docContents1.data).notContains({ uiSchema: { remarks: { "ui:widget": "" } } });

  // Check that the second Covering Letter has been downloaded successfully
  await t.click(DownloadLink.nth(1));
  const filePath2 = getFileDownloadPath(fileName2);
  await t.expect(await waitForFileDownload(t, filePath2)).eql(true);

  // We expect the contents of the second doc to contain the uiSchema key,
  // one at the root level, the other nested in `misc`
  const docContents2 = JSON.parse(readFileSync(filePath2, "utf8"));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await t.expect(docContents2.data.misc.uiSchema.remarks["ui:widget"]).contains("textarea");
});
