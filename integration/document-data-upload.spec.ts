import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";
import { join } from "path";
import { homedir } from "os";
import { existsSync, read, readFileSync } from "fs";

fixture("Data upload").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";
const DataFileCsv = "./../src/test/fixtures/sample-data-file-csv.csv";
const Title = Selector("h1");
const ProgressBar = Selector("[data-testid='progress-bar']");

const Button = Selector("button");
const FormTitleField = Selector("#root_title");
const FormRemarksField = Selector("#root_remarks");
const nextDocumentButton = Selector("[data-testid='next-document-button']");
const fileNameField = Selector("[data-testid='file-name-input']");
const downloadCsvDataFileButton = Selector("[data-testid='download-csv-data-schema-button']");
const downloadJsonDataFileButton = Selector("[data-testid='download-json-data-schema-button']");

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

test("should upload populate data fields correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("Covering Letter"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // download csv data sample file
  await t.click(downloadCsvDataFileButton);
  const csvFilePath = getFileDownloadPath("sample-data.csv");
  await t.expect(await waitForFileDownload(t, csvFilePath)).eql(true);
  const csvFileContent = readFileSync(csvFilePath, "utf8");
  await t.expect(csvFileContent).contains("title,remarks");

  //download json data sample file
  await t.click(downloadJsonDataFileButton);
  const jsonFilePath = getFileDownloadPath("sample-data.json");
  await t.expect(await waitForFileDownload(t, jsonFilePath)).eql(true);
  const jsonFileContent = JSON.parse(readFileSync(jsonFilePath, "utf8"));
  await t.expect(jsonFileContent.data).contains({ title: "", remarks: "" });

  // Upload data file
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [DataFileCsv]);

  // Validated the content is overwritten by the data file
  await t.expect(fileNameField.value).eql("Covering Letter-2");
  await t.expect(FormTitleField.value).eql("Testing1");
  await t.expect(FormRemarksField.value).eql("Testing1");

  // Check next document
  await t.click(nextDocumentButton);
  await t.expect(fileNameField.value).eql("Covering Letter-3");
  await t.expect(FormTitleField.value).eql("Testing2");
  await t.expect(FormRemarksField.value).eql("Testing2");
});
