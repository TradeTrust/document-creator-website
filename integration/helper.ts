import { Selector, t } from "testcafe";

const PasswordField = Selector("[data-testid='password-field']");
const ButtonLogin = Selector("[data-testid='login-button']");

// fixtures
export const configLocal = "./../src/test/fixtures/v2/config/local/sample-config-local.json";
export const configLocalV3 = "./../src/test/fixtures/v3/config/local/sample-config-local-v3.json";
export const configLocalErrorDocumentIssue =
  "./../src/test/fixtures/v2/config/local/sample-config-error-document-issue.json";
export const configLocalWalletless = "./../src/test/fixtures/v2/config/local/sample-config-error-walletless.json";
export const configLocalEmpty = "./../src/test/fixtures/v2/config/local/sample-config-error-empty.json";
export const configRopsten = "./../src/test/fixtures/v2/config/ropsten/sample-config-ropsten.json";
export const dataFileJsonEblMissingFields =
  "./../src/test/fixtures/v2/data-file/sample-data-file-ebl-error-missing-fields.json";
export const dataFileJsonCoo = "./../src/test/fixtures/v2/data-file/sample-data-file-coo.json";
export const dataFileJsonEbl = "./../src/test/fixtures/v2/data-file/sample-data-file-ebl.json";
export const dataFileCsvEbl = "./../src/test/fixtures/v2/data-file/sample-data-file-ebl.csv";
export const dataFileCsvCoo = "./../src/test/fixtures/v2/data-file/sample-data-file-coo.csv";
export const dataFileCsvCooV3 = "./../src/test/fixtures/v3/data-file/sample-data-file-coo-v3.csv";
export const samplePdf = "./../src/test/fixtures/sample-file.pdf";
export const samplePdf6Mb = "./../src/test/fixtures/sample-file-6MB.pdf";
export const documentRevoked = "./../src/test/fixtures/v2/wrapped/wrapped-document-local-revokable.json";

export const loadConfigFile = async (configFile: string): Promise<void> => {
  await t.setFilesToUpload("input[type=file][data-testid=config-file-drop-zone]", [configFile]);
};

export const enterPassword = async (password: string): Promise<void> => {
  await t.typeText(PasswordField, password);
  await t.click(ButtonLogin);
};

export const deletePassword = async (): Promise<void> => {
  await t.selectText(PasswordField).pressKey("delete");
};
