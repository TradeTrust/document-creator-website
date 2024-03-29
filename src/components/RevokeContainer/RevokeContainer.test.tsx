import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useConfigContext } from "../../common/context/config";
import { RevokeContainer } from "./RevokeContainer";

import sampleConfig from "../../test/fixtures/config/v3/sample-config-local.json";

jest.mock("../../common/context/config");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "/revoke",
  }),
}));

const mockUseConfigContext = useConfigContext as jest.Mock;
const withConfigFile = (): void => {
  mockUseConfigContext.mockReturnValue({ config: sampleConfig });
};
const whenNoConfig = (): void => {
  mockUseConfigContext.mockReturnValue({ config: undefined });
};

describe("RevokeContainer", () => {
  it("should load step 1 by default", () => {
    withConfigFile();
    render(
      <BrowserRouter>
        <RevokeContainer />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("revoke-file-dropzone")).toHaveLength(1);
  });

  it("should redirect to '/' if there is no config file", () => {
    whenNoConfig();
    render(
      <BrowserRouter>
        <RevokeContainer />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("revoke-file-dropzone")).toHaveLength(0);
  });
});
