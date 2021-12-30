import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";

import configRinkeby from "../../test/fixtures/config/v2/sample-config-rinkeby.json";
import configRopsten from "../../test/fixtures/config/v2/sample-config-ropsten.json";

const mockMainnetConfig = {
  network: "homestead",
};

describe("navigationBar", () => {
  it("should render the UI accordingly", () => {
    render(
      <BrowserRouter>
        <Route exact path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );

    expect(screen.queryAllByText("Resources")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-learn")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-faq")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-eta")).not.toBeNull();

    expect(screen.queryAllByText("News & Events")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-news")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-event")).not.toBeNull();

    expect(screen.queryAllByText("Contact")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-contact")).not.toBeNull();

    expect(screen.queryAllByTestId("navbar-create-doc")).not.toBeNull();
    expect(screen.queryAllByTestId("navbar-verify-doc")).not.toBeNull();
    expect(screen.queryAllByTestId("settings-icon")).not.toBeNull();
  });

  it("should render href to default verify documents page without config", () => {
    render(
      <BrowserRouter>
        <Route exact path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("navbar-verify-doc")[0]).not.toBeNull();
    expect(screen.getAllByTestId("navbar-verify-doc")[0].getAttribute("href")).toBe(`https://tradetrust.io/verify`);
  });

  it("should render href to rinkeby verify documents page with rinkeby config", () => {
    window.localStorage.setItem("CONFIG_FILE", JSON.stringify(configRinkeby));
    render(
      <BrowserRouter>
        <Route path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("navbar-verify-doc")[0]).not.toBeNull();
    expect(screen.getAllByTestId("navbar-verify-doc")[0].getAttribute("href")).toBe(
      `https://rinkeby.tradetrust.io/verify`
    );
  });

  it("should render href to ropsten verify documents page with ropsten config", () => {
    window.localStorage.setItem("CONFIG_FILE", JSON.stringify(configRopsten));
    render(
      <BrowserRouter>
        <Route path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("navbar-verify-doc")[0]).not.toBeNull();
    expect(screen.getAllByTestId("navbar-verify-doc")[0].getAttribute("href")).toBe(`https://dev.tradetrust.io/verify`);
  });

  it("should render href to mainnet verify documents page with homestead config", () => {
    window.localStorage.setItem("CONFIG_FILE", JSON.stringify(mockMainnetConfig));
    render(
      <BrowserRouter>
        <Route path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );
    expect(screen.getAllByTestId("navbar-verify-doc")[0]).not.toBeNull();
    expect(screen.getAllByTestId("navbar-verify-doc")[0].getAttribute("href")).toBe(`https://tradetrust.io/verify`);
  });
});
