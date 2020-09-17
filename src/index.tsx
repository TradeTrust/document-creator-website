import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./App";
import { ConfigContextProvider } from "./common/context/config";
import { FormsContextProvider } from "./common/context/forms";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigContextProvider>
        <FormsContextProvider>
          <App />
        </FormsContextProvider>
      </ConfigContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
