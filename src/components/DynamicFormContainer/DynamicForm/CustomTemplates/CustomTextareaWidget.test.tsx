import { render, screen } from "@testing-library/react";
import React from "react";
import { WidgetProps } from "react-jsonschema-form";
import { CustomTextareaWidget } from "./CustomTextareaWidget";

const propsToPassIntoWidget = (): WidgetProps => {
  return {
    id: "2",
    placeholder: "some placeholder text",
    value: "some default text",
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
    onChange: (value: string) => {
      console.log(value);
    },
    onBlur: (id: string, value: string | number | boolean | null) => {
      console.log(id, value);
    },
    onFocus: (id: string, value: string | number | boolean | null) => {
      console.log(id, value);
    },
    schema: {
      format: undefined,
      type: "string",
      title: "Component Title",
    },
    options: {
      rows: 4,
    },
    formContext: "",
    label: "text area label",
    rawErrors: [],
  };
};

describe("customTextareaWidget", () => {
  it("should render the correct textarea", () => {
    render(<CustomTextareaWidget {...propsToPassIntoWidget()} />);

    expect(screen.queryAllByText("some default text")).toHaveLength(1);
    expect(screen.queryAllByPlaceholderText("some placeholder text")).toHaveLength(1);
  });
});
