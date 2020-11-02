import { render, screen } from "@testing-library/react";
import React from "react";
import { NavigationBar } from "./NavigationBar";
import { BrowserRouter, Route } from "react-router-dom";
import rinkebyConfig from "../../test/fixtures/sample-rinkeby-config.json";
import ropstenConfig from "../../test/fixtures/sample-config.json";

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

    expect(screen.queryAllByText("Verify Documents")).not.toBeNull();
    expect(screen.queryAllByText("Create Documents")).not.toBeNull();
    expect(screen.queryAllByText("Resources")).not.toBeNull();
    expect(screen.queryAllByText("FAQ")).not.toBeNull();
    expect(screen.queryAllByText("Contact")).not.toBeNull();
    expect(screen.queryByTestId("settings-icon")).not.toBeNull();
  });

  it("should render href to default verify documents page without config", () => {
    render(
      <BrowserRouter>
        <Route exact path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );

    expect(screen.getByText("Verify Documents").closest("a")).toHaveAttribute(
      "href",
      "https://tradetrust.io/#verify-documents"
    );
  });

  it("should render href to rinkeby verify documents page with rinkeby config", () => {
    window.localStorage.setItem("CONFIG_FILE", JSON.stringify(rinkebyConfig));
    render(
      <BrowserRouter>
        <Route path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );

    expect(screen.getByText("Verify Documents").closest("a")).toHaveAttribute(
      "href",
      "https://rinkeby.tradetrust.io/#verify-documents"
    );
  });

  it("should render href to ropsten verify documents page with ropsten config", () => {
    window.localStorage.setItem("CONFIG_FILE", JSON.stringify(ropstenConfig));
    render(
      <BrowserRouter>
        <Route path="/">
          <NavigationBar logout={() => {}} />
        </Route>
      </BrowserRouter>
    );

    expect(screen.getByText("Verify Documents").closest("a")).toHaveAttribute(
      "href",
      "https://dev.tradetrust.io/#verify-documents"
    );
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

    expect(screen.getByText("Verify Documents").closest("a")).toHaveAttribute(
      "href",
      "https://tradetrust.io/#verify-documents"
    );
  });
});
