import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import { v2 } from "@govtechsg/open-attestation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useConfigContext } from "../../../common/context/config";
import { checkContractOwnership } from "../../../services/prechecks";
import sampleConfig from "../../../test/fixtures/config/v3/sample-config-mumbai.json";
import { FormTemplate } from "../../../types";
import { FormSelect } from "./FormSelect";

jest.mock("@govtechsg/dnsprove", () => ({
  getDnsDidRecords: jest.fn(),
  getDocumentStoreRecords: jest.fn(),
}));

jest.mock("../../../common/context/config");
jest.mock("../../../services/prechecks", () => {
  const originalModule = jest.requireActual("../../../services/prechecks");

  return {
    __esModule: true,
    ...originalModule,
    checkContractOwnership: jest.fn(),
  };
});

const mockCheckContractOwnership = checkContractOwnership as jest.Mock;
const mockGetDocumentStoreRecords = getDocumentStoreRecords as jest.Mock;
const mockUseConfigContext = useConfigContext as jest.Mock;

const mockRecordsDnsTxt = [
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x10E936e6BA85dC92505760259881167141365821",
    dnssec: true,
  },
  {
    type: "openatts",
    net: "ethereum",
    netId: "3",
    addr: "0x13249BA1Ec6B957Eb35D34D7b9fE5D91dF225B5B",
    dnssec: true,
  },
];

const mockFormInvoiceV2FailDnsLocation: FormTemplate = {
  name: "TradeTrust Invoice v2",
  type: "VERIFIABLE_DOCUMENT",
  defaults: {
    $template: {
      type: v2.TemplateType.EmbeddedRenderer,
      name: "INVOICE",
      url: "https://generic-templates.tradetrust.io",
    },
    issuers: [
      {
        name: "Demo Issuer",
        documentStore: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
        identityProof: {
          type: v2.IdentityProofType.DNSTxt,
          location: "abc.com",
        },
        revocation: {
          type: v2.RevocationType.None,
        },
      },
    ],
  },
  schema: {},
};

describe("formSelect", () => {
  beforeEach(() => {
    mockUseConfigContext.mockReturnValue({
      config: {
        ...sampleConfig,
        wallet: {
          ...sampleConfig.wallet,
          getAddress: () => {
            return "0x" + JSON.parse(sampleConfig.wallet.encryptedJson).address;
          },
        },
      },
    });
    mockGetDocumentStoreRecords.mockResolvedValue(mockRecordsDnsTxt);
  });

  it("should show file name", async () => {
    mockCheckContractOwnership.mockResolvedValue("VALID");
    await waitFor(() => {
      render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={() => {}} />);
    });
    expect(screen.getByText("TradeTrust Invoice v2")).toBeInTheDocument();
  });

  it("should show tooltip with dns error message", async () => {
    mockCheckContractOwnership.mockResolvedValue("VALID");

    render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={() => {}} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("TradeTrust Invoice v2"));
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("The contract could not be found on it's DNS TXT records.")).toBeInTheDocument();
    });
  });

  it("should show tooltip with dns and ownership error message", async () => {
    mockCheckContractOwnership.mockResolvedValue({
      type: "ownership",
      message: "The contract does not belong to the wallet.",
    });

    render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={() => {}} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("TradeTrust Invoice v2"));
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "The contract could not be found on it's DNS TXT records. The contract does not belong to the wallet."
        )
      ).toBeInTheDocument();
    });
  });

  it("should have a success case", async () => {
    mockCheckContractOwnership.mockResolvedValue("VALID");

    const mockValidRecordsDnsTxt = [
      {
        ...mockRecordsDnsTxt[0],
        addr: "0x8bA63EAB43342AAc3AdBB4B827b68Cf4aAE5Caca",
      },
    ];

    mockGetDocumentStoreRecords.mockResolvedValue(mockValidRecordsDnsTxt);

    const spyCall = {
      called: () => {
        return true;
      },
    };

    const spy = jest.spyOn(spyCall, "called");

    render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={spyCall.called} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText("TradeTrust Invoice v2"));
      expect(spy).toHaveBeenCalled();
    });
  });
});
