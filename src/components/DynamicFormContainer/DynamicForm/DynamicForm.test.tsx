import { render, screen } from "@testing-library/react";
import React from "react";
import sampleConfig from "../../../test/fixtures/sample-config.json";
import { FormTemplate, FormType } from "../../../types";
import { DynamicForm } from "./DynamicForm";

const mockSetFormData = jest.fn();
const mockSetOwnership = jest.fn();

// COO
const form0 = sampleConfig.forms[0] as FormTemplate;
const form0Props = {
  type: "TRANSFERABLE_RECORD" as FormType,
  schema: form0.schema,
  form: {
    fileName: "",
    data: { formData: {} },
    templateIndex: 0,
    ownership: { beneficiaryAddress: "", holderAddress: "" },
  },
  setFormData: mockSetFormData,
  setOwnership: mockSetOwnership,
  attachmentAccepted: false,
};

// Covering Letter (DBS)
const form3 = sampleConfig.forms[3] as FormTemplate;
const form3Props = {
  type: "TRANSFERABLE_RECORD" as FormType,
  schema: form3.schema,
  uiSchema: form3.uiSchema, // form3 has uiSchema on the first level
  form: {
    fileName: "",
    data: { formData: {} },
    templateIndex: 0,
    ownership: { beneficiaryAddress: "", holderAddress: "" },
  },
  setFormData: mockSetFormData,
  setOwnership: mockSetOwnership,
  attachmentAccepted: false,
};

// Covering Letter (DBS, Nested UISchema)
const form4 = sampleConfig.forms[4] as FormTemplate;
const form4Props = {
  type: "TRANSFERABLE_RECORD" as FormType,
  schema: form4.schema,
  uiSchema: form4.uiSchema, // form4 does not have uiSchema on the first level
  form: {
    fileName: "",
    data: { formData: {} },
    templateIndex: 0,
    ownership: { beneficiaryAddress: "", holderAddress: "" },
  },
  setFormData: mockSetFormData,
  setOwnership: mockSetOwnership,
  attachmentAccepted: false,
};

describe("dynamicForm", () => {
  beforeEach(() => {
    mockSetFormData.mockReset();
  });

  describe("for COO", () => {
    it("should render the fields from the form definition", async () => {
      render(<DynamicForm {...form0Props} />);
      expect(screen.queryByLabelText("Information")).not.toBeNull();
    });

    it("should show the ownership section when type is transferable record", () => {
      render(<DynamicForm {...form0Props} />);
      expect(screen.queryByTestId("transferable-record-form")).not.toBeNull();
    });

    it("should not show the ownership section when type is verifiable document", () => {
      render(<DynamicForm {...form0Props} type="VERIFIABLE_DOCUMENT" />);
      expect(screen.queryByTestId("transferable-record-form")).toBeNull();
    });

    it("should render the attachment dropzone section if attachment is accepted", () => {
      render(<DynamicForm {...form0Props} attachmentAccepted={true} />);
      expect(screen.queryByTestId("attachment-dropzone")).not.toBeNull();
    });

    it("should not render the attachment dropzone section if attachment is not accepted", () => {
      render(<DynamicForm {...form0Props} attachmentAccepted={false} />);
      expect(screen.queryByTestId("attachment-dropzone")).toBeNull();
    });

    it("should render the data file dropzone", () => {
      render(<DynamicForm {...form0Props} />);
      expect(screen.queryByTestId("data-upload-zone")).not.toBeNull();
    });
  });

  describe("for Covering Letter (DBS)", () => {
    it("should render the remarks field as a textarea", () => {
      const { container } = render(<DynamicForm {...form3Props} />);
      // we expect form3 to render Remarks as a textarea
      expect(container.querySelector("textarea")).toBeInTheDocument();
    });
  });

  describe("for Covering Letter (DBS, Nested UISchema)", () => {
    it("should not render the remarks field as a textarea", () => {
      // form3 and form4 are similar, except that form4 has uiSchema nested in defaults
      const { container } = render(<DynamicForm {...form4Props} />);
      // we expect form4 to NOT render Remarks as a textarea
      expect(container.querySelector("textarea")).not.toBeInTheDocument();
    });
  });
});
