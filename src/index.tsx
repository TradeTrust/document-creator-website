import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./App";
import { ConfigContextProvider } from "./common/context/config";
import { FormsContextProvider } from "./common/context/forms";

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <FormsContextProvider>
        <App />
      </FormsContextProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
