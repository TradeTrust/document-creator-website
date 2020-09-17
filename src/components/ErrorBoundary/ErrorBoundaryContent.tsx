import React, { FunctionComponent } from "react";
import logo from "../NavigationBar/logo.svg";
import { Title } from "../UI/Title";
import { Button } from "../UI/Button";
import { CodeBlock } from "../UI/CodeBlock";

export const ErrorBoundaryContent: FunctionComponent<{
  error?: string;
}> = ({ error }) => (
  <div
    className="flex min-h-screen min-w-screen items-center justify-center"
    data-testid="error-boundary-content"
  >
    <div className="container max-w-screen-sm">
      <img
        style={{ width: 120, height: "auto" }}
        className="mb-6"
        src={logo}
        alt="TradeTrust Logo"
      />
      <Title className="mb-6">Oops...something went wrong</Title>
      <div className="mb-2">TradeTrust has encountered an issue.</div>
      <div>We are sorry, please</div>
      <ol className="mb-2">
        <li>1. Either contact the person who set up the configuration file, or</li>
        <li>
          2. If the issue is not with configuration, do file an issue on our{" "}
          <a
            className="text-blue cursor-pointer"
            href="https://github.com/TradeTrust/document-creator-website/issues/new"
          >
            github repository
          </a>
        </li>
      </ol>
      {error && (
        <div className="mb-6">
          <CodeBlock code={error} />
        </div>
      )}
      <Button
        className="bg-orange text-white py-3 px-4"
        data-testid="form-logout-button"
        onClick={() => window.location.reload()}
      >
        Reload Application
      </Button>
    </div>
  </div>
);
