import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Error document issue").page`http://localhost:3000`;

const ConfigFailPublishDocument = "./../src/test/fixtures/sample-config-error-document-issue.json";
const Title = Selector("h1");
const Button = Selector("button");
const SubmitButton = Selector("[data-testid='form-submit-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should show failed published document(s) errors", async (t) => {
  // Upload config file
  await loadConfigFile(ConfigFailPublishDocument);
  await t.expect(Title.textContent).contains("Create and Revoke Document");

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("1");

  // Navigate to form
  await t.click(Button.withText("Covering Letter (GT)"));

  // Submit form
  await t.click(SubmitButton);

  // Failed published document
  await t.expect(Title.textContent).contains("Document(s) failed to issue");
  await t.expect(Selector("div").withText("1 Document(s) Failed").exists).ok();
  await t
    .expect(
      Selector("div").withText(
        "These documents failed to publish due to some errors. Kindly rectify and try publishing again."
      ).exists
    )
    .ok();
  await t.expect(Selector("div").withText("Covering Letter (GT)-1-local.tt").exists).ok();
});
