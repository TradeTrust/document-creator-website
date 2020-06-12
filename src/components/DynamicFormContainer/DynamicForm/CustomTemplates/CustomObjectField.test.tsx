import { render, screen } from "@testing-library/react";
import React from "react";
import { CustomObjectFieldTemplate } from "./CustomObjectField";

const mockTitleComponent = ({
  id,
  title,
  required,
}: {
  id: string;
  title: string;
  required: boolean;
}): React.ReactElement => {
  return (
    <div key={id} id={id} data-testid={"mock-title"}>
      {title}
      {required && <span>*</span>}
    </div>
  );
};

const mockProperties = new Array(2).fill(null).map((_arr, index) => {
  return {
    content: <div>Properties Component {index}</div>,
  };
});

const whenAllFieldsArePresent = (): any => {
  return {
    TitleField: mockTitleComponent,
    properties: mockProperties,
    title: "Component Title",
    description: "Component Description",
    required: false,
  };
};

const whenTitleIsNotPresent = (): any => {
  return {
    TitleField: mockTitleComponent,
    properties: mockProperties,
    title: "",
    description: "Component Description",
    required: false,
  };
};

describe("customObjectFieldTemplate", () => {
  it("should render all fields correctly", () => {
    render(<CustomObjectFieldTemplate {...whenAllFieldsArePresent()} />);
    expect(screen.getByText("Component Description")).not.toBeNull();
    expect(screen.getByText("Component Title")).not.toBeNull();
    expect(screen.getAllByText(/Properties Component/)).not.toBeNull();
  });

  it("should render title if it exist", () => {
    render(<CustomObjectFieldTemplate {...whenTitleIsNotPresent()} />);
    expect(screen.queryByTestId("mock-title")).toBeNull();

    render(<CustomObjectFieldTemplate {...whenAllFieldsArePresent()} />);
    expect(screen.queryByTestId("mock-title")).not.toBeNull();
  });

  it("should render all properties in a list", () => {
    render(<CustomObjectFieldTemplate {...whenAllFieldsArePresent()} />);
    expect(screen.getAllByText(/Properties Component/)).toHaveLength(2);
  });
});
