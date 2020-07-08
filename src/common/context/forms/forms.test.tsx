import { act, renderHook } from "@testing-library/react-hooks";
import React, { FunctionComponent } from "react";
import { FormsContextProvider, useFormsContext } from "./index";

const wrapper: FunctionComponent = ({ children }) => (
  <FormsContextProvider>{children}</FormsContextProvider>
);

describe("useFormsContext", () => {
  it("should have correct initial state", () => {
    const { result } = renderHook(() => useFormsContext(), { wrapper });

    expect(result.current.forms).toStrictEqual([]);
    expect(result.current.activeFormIndex).toBeUndefined();
    expect(result.current.currentForm).toBeUndefined();
    expect(result.current.currentFormData).toBeUndefined();
    expect(result.current.currentFormOwnership).toBeUndefined();
  });

  it("should add a new form when newForm is called", async () => {
    const { result } = renderHook(() => useFormsContext(), { wrapper });

    act(() => {
      result.current.newForm(1);
    });

    const expectedFormData = {
      templateIndex: 1,
      data: {},
      fileName: "Document-1.tt",
      ownership: { holderAddress: "", beneficiaryAddress: "" },
    };

    expect(result.current.forms).toStrictEqual([expectedFormData]);
    expect(result.current.activeFormIndex).toStrictEqual(0);
    expect(result.current.currentForm).toStrictEqual(expectedFormData);
    expect(result.current.currentFormData).toStrictEqual(expectedFormData.data);
    expect(result.current.currentFormOwnership).toStrictEqual({
      beneficiaryAddress: "",
      holderAddress: "",
    });
  });

  it("should edit current form with setCurrentFormData", async () => {
    const { result } = renderHook(() => useFormsContext(), { wrapper });

    act(() => {
      result.current.newForm(1);
    });
    act(() => {
      result.current.newForm(0);
    });
    act(() => {
      result.current.newForm(1);
    });
    act(() => {
      result.current.setActiveFormIndex(1);
    });
    act(() => {
      result.current.setCurrentFormData({ formData: { foo: "bar" } });
    });

    const expectedForms = [
      {
        templateIndex: 1,
        data: {},
        fileName: "Document-1.tt",
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
      {
        templateIndex: 0,
        data: { formData: { foo: "bar" } },
        fileName: "Document-2.tt",
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
      {
        templateIndex: 1,
        data: {},
        fileName: "Document-3.tt",
        ownership: { holderAddress: "", beneficiaryAddress: "" },
      },
    ];

    expect(result.current.forms).toStrictEqual(expectedForms);
    expect(result.current.activeFormIndex).toStrictEqual(1);
    expect(result.current.currentForm).toStrictEqual(expectedForms[1]);
    expect(result.current.currentFormData).toStrictEqual(expectedForms[1].data);
  });

  it("should edit current form's ownership data with setCurrentFormOwnership", () => {
    const { result } = renderHook(() => useFormsContext(), { wrapper });

    act(() => {
      result.current.newForm(1);
    });
    act(() => {
      result.current.setCurrentFormOwnership({
        beneficiaryAddress: "0x0Foo",
        holderAddress: "0x0Bar",
      });
    });

    const expectedFormWithOwnership = [
      {
        templateIndex: 1,
        data: {},
        fileName: "Document-1.tt",
        ownership: { holderAddress: "0x0Bar", beneficiaryAddress: "0x0Foo" },
      },
    ];

    expect(result.current.forms).toStrictEqual(expectedFormWithOwnership);
  });
});
