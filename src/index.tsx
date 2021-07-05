import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
import "./index.css";
import { App } from "./App";
import { ConfigContextProvider } from "./common/context/config";
import { FormsContextProvider } from "./common/context/forms";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OverlayContextProvider } from "@govtechsg/tradetrust-ui-components";

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ConfigContextProvider>
        <FormsContextProvider>
          <OverlayContextProvider>
            <App />
          </OverlayContextProvider>
        </FormsContextProvider>
      </ConfigContextProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
