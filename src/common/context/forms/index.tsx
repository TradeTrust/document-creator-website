import React, { useState, useContext, createContext, FunctionComponent } from "react";
import { FormEntry, FormData } from "../../../types";

interface FormsContext {
  activeFormIndex?: number;
  forms: FormEntry[];
  currentForm?: FormEntry;
  currentFormData?: FormData;
  setActiveFormIndex: (index?: number) => void;
  setForms: (forms: FormEntry[]) => void;
  newForm: (templateIndex: number) => void;
  setCurrentFormData: (formData: FormData) => void;
}

export const FormsContext = createContext<FormsContext>({
  forms: [],
  setActiveFormIndex: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setForms: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  newForm: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  setCurrentFormData: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useFormsContext = (): FormsContext => useContext<FormsContext>(FormsContext);

export const FormsContextProvider: FunctionComponent = ({ children }) => {
  const [activeFormIndex, setActiveFormIndex] = useState<number | undefined>(undefined);
  const [forms, setForms] = useState<FormEntry[]>([]);

  const newForm = (templateIndex: number) => {
    const newIndex = forms.length;
    setForms([
      ...forms,
      { templateIndex, data: {} as any, fileName: `Document-${forms.length + 1}.tt` },
    ]);
    setActiveFormIndex(newIndex);
  };

  const currentForm = activeFormIndex === undefined ? undefined : forms[activeFormIndex];
  const currentFormData = currentForm ? currentForm.data : undefined;
  const setCurrentFormData = (data: any) => {
    if (activeFormIndex === undefined)
      throw new Error("Trying to set form when there is no activeFormIndex");
    const nextForms = [...forms];
    const currentForm = forms[activeFormIndex];
    nextForms.splice(activeFormIndex, 1, { ...currentForm, data });
    setForms(nextForms);
  };

  return (
    <FormsContext.Provider
      value={{
        activeFormIndex,
        forms,
        currentForm,
        currentFormData,
        setCurrentFormData,
        newForm,
        setActiveFormIndex,
        setForms,
      }}
    >
      {children}
    </FormsContext.Provider>
  );
};
