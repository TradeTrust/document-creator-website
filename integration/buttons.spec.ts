import { Selector } from "testcafe";
import { enterPassword, loadConfigFile } from "./helper";

fixture("Buttons").page`http://localhost:3000`;

const Config = "./../src/test/fixtures/sample-config-local.json";

const Title = Selector("h1");
const Button = Selector("button");
const ButtonBack = Selector("[data-testid='back-button']");
const ButtonBackRed = Selector("[data-testid='red-back-button']");
const ProgressBar = Selector("[data-testid='progress-bar']");

test("should lead to pages correctly", async (t) => {
  // Upload config file
  await loadConfigFile(Config);
  await t.expect(Title.textContent).contains("Create Document");
  await t.expect(Selector("[data-testid='login-title']").textContent).contains("Login");

  // Check if on correct network
  await t.expect(Selector("[data-testid='network-bar']").withText("Local network").exists).ok();

  // Login to step 1
  await enterPassword("password");
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
  await t.expect(ProgressBar.textContent).contains("Step 1/3");

  // Navigate to form
  await t.click(Button.withText("Covering Letter"));

  // Check back button
  await t.click(ButtonBack);
  await t.expect(Selector("[data-testid='modal-title']").textContent).contains("Back to form selection");
  await t.click(ButtonBackRed);
  await t.expect(Title.textContent).contains("Choose Document Type to Issue");
});
