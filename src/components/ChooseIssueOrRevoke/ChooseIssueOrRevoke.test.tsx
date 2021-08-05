import { render, screen } from "@testing-library/react";
import { ChooseIssueOrRevoke } from "./ChooseIssueOrRevoke";
import { BrowserRouter, useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

const selectedClassName = "text-blue underline";

describe("ChooseIssueOrRevoke", () => {
  it("should render component correctly and select 'Revoke Document' button", () => {
    mockUseLocation.mockImplementation(() => ({
      pathname: "/revoke",
    }));
    render(
      <BrowserRouter>
        <ChooseIssueOrRevoke />
      </BrowserRouter>
    );

    expect(screen.queryByText("Revoke Document")?.className).toStrictEqual(selectedClassName);
  });

  it("should render component correctly and select 'Issue Document' button", () => {
    mockUseLocation.mockImplementation(() => ({
      pathname: "/form",
    }));
    render(
      <BrowserRouter>
        <ChooseIssueOrRevoke />
      </BrowserRouter>
    );

    expect(screen.queryByText("Issue Document")?.className).toStrictEqual(selectedClassName);
  });
});
