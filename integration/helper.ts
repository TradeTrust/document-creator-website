import { Selector, t } from "testcafe";

const PasswordField = Selector("[data-testid='password-field']");
const ButtonLogin = Selector("[data-testid='login-button']");

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
