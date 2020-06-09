import React from "react";
import ReactDOM from "react-dom";
// it will fail in the ci because the file may not exist => disabled
// eslint-disable-next-line import/no-unresolved
import "./index.css";
import { App } from "./App";
import { ConfigContextProvider } from "./common/context/config";
import { ActiveFormContextProvider } from "./common/context/activeForm";

ReactDOM.render(
  <React.StrictMode>
    <ConfigContextProvider>
      <ActiveFormContextProvider>
        <App />
      </ActiveFormContextProvider>
    </ConfigContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
