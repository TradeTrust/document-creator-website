import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Document Creator").page`http://localhost:3000`;

const ConfigFailPublishDocument = "./../src/test/fixtures/sample-config-fail-publish-document.json";
const Title = Selector("h1");
const Button = Selector("button");
const SubmitButton = Selector("[data-testid='form-submit-button']");

test("Upload configuration file, choose form, submit form, encounter failed published document", async (t) => {
  // upload configuration file
  await loadConfigFile(ConfigFailPublishDocument);

  // enter password
  await enterPassword("password");

  // choose form
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.click(Button.withText("Covering Letter (GT)"));

  // sibmit form
  await t.click(SubmitButton);

  // encounter failed published document
  await t.expect(Title.textContent).contains("Document(s) failed to issue");
  await t.expect(Selector("div").withText("1 Document(s) Failed").exists).ok();
  await t
    .expect(
      Selector("div").withText(
        "These documents failed to publish due to some errors. Kindly rectify and try publishing again."
      ).exists
    )
    .ok();
  await t.expect(Selector("div").withText("Document-1-local.tt").exists).ok();
});
