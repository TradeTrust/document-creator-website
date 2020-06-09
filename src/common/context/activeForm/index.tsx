import React, { useState, useContext, createContext, FunctionComponent } from "react";

interface ActiveFormContext {
  activeFormIndex?: number;
  setActiveFormIndex: (index: number) => void;
}

export const ActiveFormContext = createContext<ActiveFormContext>({
  activeFormIndex: undefined,
  setActiveFormIndex: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useActiveFormContext = (): ActiveFormContext =>
  useContext<ActiveFormContext>(ActiveFormContext);

export const ActiveFormContextProvider: FunctionComponent = ({ children }) => {
  const [activeFormIndex, setActiveFormIndex] = useState<number | undefined>(undefined);

  return (
    <ActiveFormContext.Provider
      value={{
        activeFormIndex,
        setActiveFormIndex,
      }}
    >
      {children}
    </ActiveFormContext.Provider>
  );
};
