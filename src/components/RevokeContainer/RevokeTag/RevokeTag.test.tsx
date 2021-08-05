import { render, screen } from "@testing-library/react";
import { RevokeTag } from "./RevokeTag";
import { BrowserRouter } from "react-router-dom";
import sampleRevokableDocument from "../../../test/fixtures/sample-wrapped-document.json";

describe("RevokeTag", () => {
  it("should render the file tag correctly with then given properties", () => {
    render(
      <BrowserRouter>
        <RevokeTag doc={sampleRevokableDocument} isPending={false} fileName="doc-1.tt" />
      </BrowserRouter>
    );

    expect(screen.queryByTestId("file-name")?.textContent).toStrictEqual("doc-1.tt (1.71 kB)");
  });

  it("should render loader spinner when isPending is true", () => {
    render(
      <BrowserRouter>
        <RevokeTag doc={sampleRevokableDocument} isPending={true} fileName="doc-1.tt" />
      </BrowserRouter>
    );
    expect(screen.queryAllByTestId("loader-spinner")).toHaveLength(1);
  });
});
