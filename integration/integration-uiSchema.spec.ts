import { ClientFunction, Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-local-config.json";

const Title = Selector("h1");
const Button = Selector("button");
const Form = Selector("[data-testid='form-group field field-object']");
const AddNewButton = Selector("[data-testid='add-new-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const DocumentTitleField = Selector("#root_title");
const DocumentRemarksField = Selector("#root_remarks");
const goBack = ClientFunction(() => window.history.back());
const DownloadLink = Selector("[data-testid='download-file-button']");

test("Upload configuration file, choose form, form renders correctly according to uiSchema, publishes correctly", async (t) => {
  // Check go to doc button
  await t.click(Selector("[data-testid='config-file-docs-button']"));
  await t.expect(Title.textContent).contains("Using TradeTrust Document Creator");
  await goBack();

  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // login
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("Covering Letter (DBS)"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // Validate that default values is populated
  await t.expect(DocumentTitleField.value).contains("Documents Bundle");
  await t
    .expect(DocumentRemarksField.value)
    .contains("Some very important documents in here for some submission");

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
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // Validate that default values is populated
  await t.expect(DocumentTitleField.value).contains("Documents Bundle");
  await t
    .expect(DocumentRemarksField.value)
    .contains("Some very important documents in here for some submission");

  // Expect remarks field to be a normal input field (because uiSchema does not exist at the form template's root level)
  await t
    .expect(Form.find("input#root_remarks").value)
    .contains("Some very important documents in here for some submission");

  // Submit
  await t.click(SubmitButton);

  // pending confirmation of issued documents
  await t.expect(Selector("[data-testid='publish-loader']").exists).ok();

  // Check that the two Covering Letters are created
  const fileName1 = "Document-1-local.tt";
  const fileName2 = "Document-2-local.tt";
  await t.expect(Title.textContent).contains("Document(s) issued successfully");
  await t.expect(Selector("div").withText(fileName1).exists).ok();
  await t.expect(Selector("div").withText(fileName2).exists).ok();
  await t.expect(Selector("div").withText("Download").exists).ok();

  // Check that the first Covering Letter has been downloaded successfully
  // await t.click(downloadLink.nth(0));
  // const downloadLink1 = await DownloadLink.nth(0).getAttribute("href");
  // console.log(downloadLink1);
  // const [download] = await Promise.all([t.click(DownloadLink.nth(0))]);

  // const path = await download.path();
  // console.log(path);
  // const downloadedData1 = getData();

  // We expect the contents of the first doc to NOT contain uiSchema key
  // Only doing a `contains` check because the value is non-deterministic due to the hash
  // const docContents1 = JSON.parse(readFileSync(filePath1, "utf8"));
  // await t.expect(docContents1.data).notContains({ uiSchema: { remarks: { "ui:widget": "" } } });

  // Check that the second Covering Letter has been downloaded successfully
  // await t.click(downloadLink.nth(1));

  // We expect the contents of the second doc to contain the uiSchema key,
  // one at the root level, the other nested in `misc`
  // const docContents2 = readFileSync(filePath2, "utf8");
  // await t.expect(docContents2).contains("uiSchema");
  // await t.expect(docContents2).contains("remarks");
  // await t.expect(docContents2).contains("ui:widget");
  // await t.expect(docContents2).contains("textarea");
});
