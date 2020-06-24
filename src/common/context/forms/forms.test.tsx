import React, { FunctionComponent } from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFormsContext, FormsContextProvider } from "./index";

const wrapper: FunctionComponent = ({ children }) => (
  <FormsContextProvider>{children}</FormsContextProvider>
);

describe("useFormsContext", () => {
    it("should have correct initial state", () => {
      const { result } = renderHook(() => useFormsContext(), { wrapper });
    
      expect(result.current.forms).toEqual([]);
      expect(result.current.activeFormIndex).toEqual(undefined);
      expect(result.current.currentForm).toEqual(undefined);
      expect(result.current.currentFormData).toEqual(undefined);
    });
    
    it("should add a new form when newForm is called", async () => {
      const { result } = renderHook(() => useFormsContext(), { wrapper });
    
      act(() => {
        result.current.newForm(1);
      });
    
      const expectedFormData = { templateIndex: 1, data: {}, fileName: "Document-1.tt" };
    
      expect(result.current.forms).toEqual([expectedFormData]);
      expect(result.current.activeFormIndex).toEqual(0);
      expect(result.current.currentForm).toEqual(expectedFormData);
      expect(result.current.currentFormData).toEqual(expectedFormData.data);
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
        },
        {
          templateIndex: 0,
          data: { formData: { foo: "bar" } },
          fileName: "Document-2.tt",
        },
        {
          templateIndex: 1,
          data: {},
          fileName: "Document-3.tt",
        },
      ];
    
      expect(result.current.forms).toEqual(expectedForms);
      expect(result.current.activeFormIndex).toEqual(1);
      expect(result.current.currentForm).toEqual(expectedForms[1]);
      expect(result.current.currentFormData).toEqual(expectedForms[1].data);
    });
});
