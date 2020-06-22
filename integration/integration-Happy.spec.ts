import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config.json";
const Title = Selector("h1");
const Button = Selector("button");
const ButtonLogin = Selector("[data-testid='login-button']");
const ButtonBack = Selector("[data-testid='back-button']");
const PasswordField = Selector("[data-testid='password-field']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("Upload configuration file, choose form, fill form, preview form, submit form correctly", async (t) => {
  // upload config
  await t.expect(Title.textContent).contains("Upload Configuration File");
  await t.setFilesToUpload("input[type=file]", [Config]);
  await t.expect(Title.textContent).contains("Login with Password");

  // login to step 1
  await t.typeText(PasswordField, "password");
  await t.click(ButtonLogin);
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // move to step 2
  await t.click(Button.withText("Bill of Lading"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // try back button
  await t.click(ButtonBack);
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // step 2 to fill form
  await t.click(Button.withText("Bill of Lading"));
  await t.expect(Title.textContent).contains("Fill and Preview Form");
  await t.expect(ProgressBar.textContent).contains("Step 2/3");

  // preview form
  // submit form
});
