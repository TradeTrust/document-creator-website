import { v2 } from "@govtechsg/open-attestation";
import { getDocumentStoreRecords } from "@govtechsg/dnsprove";
import React, { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FormSelect } from "./FormSelect";
import { FormTemplate } from "../../../types";

jest.mock("@govtechsg/dnsprove", () => ({
  getDnsDidRecords: jest.fn(),
  getDocumentStoreRecords: jest.fn(),
}));
const mockGetDocumentStoreRecords = getDocumentStoreRecords as jest.Mock;

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
  it("should show file name", async () => {
    mockGetDocumentStoreRecords.mockResolvedValue(mockRecordsDnsTxt);
    await waitFor(() => {
      render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={() => {}} />);
    });
    expect(screen.getByText("TradeTrust Invoice v2")).toBeInTheDocument();
  });

  it("should show tooltip with error message", async () => {
    mockGetDocumentStoreRecords.mockResolvedValue(mockRecordsDnsTxt);
    await waitFor(() => {
      render(<FormSelect id={`abc`} form={mockFormInvoiceV2FailDnsLocation} onAddForm={() => {}} />);
    });
    fireEvent.click(screen.getByText("TradeTrust Invoice v2"));

    expect(screen.getByText("The contract address could not be found on abc.com DNS TXT records.")).toBeInTheDocument();
  });
});
