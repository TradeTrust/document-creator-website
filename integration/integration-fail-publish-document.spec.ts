import { Selector } from "testcafe";

fixture("Document Creator").page`http://localhost:3000`;

const ConfigFailPublishDocument = "./../src/test/fixtures/sample-config-fail-publish-document.json";

const Title = Selector("h1");
const Button = Selector("button");
const ButtonLogin = Selector("[data-testid='login-button']");
const PasswordField = Selector("[data-testid='password-field']");
const SubmitButton = Selector("[data-testid='form-submit-button']");

test("Upload configuration file, choose form, fill form, preview form, submit form correctly", async (t) => {
  // Failed publish document
  await t.setFilesToUpload("input[type=file]", [ConfigFailPublishDocument]);
  await t.typeText(PasswordField, "password");
  await t.click(ButtonLogin);
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.click(Button.withText("Covering Letter (GT)"));
  await t.click(SubmitButton);
  await t.expect(Title.textContent).contains("Document(s) failed to issue");
  await t.expect(Selector("div").withText("1 Document(s) Failed").exists).ok();
  await t
    .expect(
      Selector("div").withText(
        "These documents failed to publish due to some errors. Kindly rectify and try publishing again."
      ).exists
    )
    .ok();
  await t.expect(Selector("div").withText("Document-1.tt").exists).ok();
});
