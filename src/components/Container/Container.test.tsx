import { render, screen } from "@testing-library/react";
import React from "react";
import { Container } from "./Container";

describe("Container", () => {
  it("should display the children", () => {
    expect.assertions(1);
    render(
      <Container>
        <div data-testid="children">FooBar</div>
      </Container>
    );
    expect(screen.getByTestId("children")).toHaveTextContent("FooBar");
  });
});
