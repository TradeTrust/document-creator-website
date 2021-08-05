import { render, screen, fireEvent } from "@testing-library/react";
import { RevokedScreen } from "./RevokedScreen";
import { useRevokeQueue } from "../../../common/hook/useRevokeQueue";
import { RevokeState } from "../../../constants/RevokeState";
import sampleConfig from "../../../test/fixtures/sample-config-ropsten.json";
import sampleRevokableDocument from "../../../test/fixtures/sample-wrapped-document.json";
import { Config } from "../../../types";
import { getDefaultProvider, Wallet } from "ethers";

const config = {
  ...sampleConfig,
  wallet: Wallet.createRandom().connect(getDefaultProvider("ropsten")),
} as Config;

jest.mock("../../../common/hook/useRevokeQueue");

const mockUseRevokeQueue = useRevokeQueue as jest.Mock;
const mockRevoke = jest.fn();

describe("RevokedScreen", () => {
  it("should render the correct title based when revoke state is INITIALIZED", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.INITIALIZED,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryByTestId("title")?.textContent).toStrictEqual("Please wait while we prepare your document(s)");
  });
  it("should render the correct title based when revoke state is PENDING", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.PENDING,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryByTestId("title")?.textContent).toStrictEqual("Revoking document(s)...");
  });
  it("should render the correct title based when revoke state is CONFIRMED with at least 1 document", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.CONFIRMED,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryByTestId("title")?.textContent).toStrictEqual("Document(s) revoked successfully");
  });
  it("should render the correct title based when revoke state is CONFIRMED with no document", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.CONFIRMED,
      revokedDocuments: [],
      failedRevokedDocuments: [{ documents: [sampleRevokableDocument], error: "Some Error" }],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryByTestId("title")?.textContent).toStrictEqual("Document(s) failed to revoke");
  });

  it("should render logout and revoke another document button when revoke state is CONFIRMED", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.CONFIRMED,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryAllByTestId("revoke-another-button")).toHaveLength(1);
    expect(screen.queryAllByTestId("logout-button")).toHaveLength(1);
  });

  it("should display revokedDocument correctly for pendingRevokeDocuments and revokedDocuments", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.PENDING,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [sampleRevokableDocument],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryByTestId("total-number-of-documents")?.textContent).toStrictEqual("2 Document(s)");
    expect(screen.queryAllByTestId("file-name")).toHaveLength(2);
    expect(screen.queryAllByTestId("loader-spinner")).toHaveLength(1);
  });

  it("should render correctly when there are failedRevokedDocuments", () => {
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.PENDING,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [{ documents: [sampleRevokableDocument], error: "Some Error" }],
      pendingRevokeDocuments: [sampleRevokableDocument],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    expect(screen.queryAllByTestId("failed-document")).toHaveLength(1);
  });

  it("should fire the correct function when logout button is pressed", () => {
    const logout = jest.fn();
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.CONFIRMED,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={() => {}}
        onLogout={logout}
        fileName="doc-1.tt"
      />
    );
    fireEvent.click(screen.getByTestId("logout-button"));
    expect(logout).toHaveBeenCalledTimes(1);
  });
  it("should fire the correct function when revoke another document button is pressed", () => {
    const revokeAnother = jest.fn();
    mockUseRevokeQueue.mockReturnValue({
      revoke: mockRevoke,
      revokeState: RevokeState.CONFIRMED,
      revokedDocuments: [sampleRevokableDocument],
      failedRevokedDocuments: [],
      pendingRevokeDocuments: [],
    });
    render(
      <RevokedScreen
        config={config}
        revokeDocuments={[sampleRevokableDocument]}
        revokeAnotherDocument={revokeAnother}
        onLogout={() => {}}
        fileName="doc-1.tt"
      />
    );
    fireEvent.click(screen.getByTestId("revoke-another-button"));
    expect(revokeAnother).toHaveBeenCalledTimes(1);
  });
});
