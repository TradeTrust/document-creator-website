import { CustomObjectFieldTemplate } from "./CustomObjectField";
import { fireEvent, render, screen, act, wait } from "@testing-library/react";
import React from "react";
import sample from "../../../../test/fixtures/sample-config.json";
import { ConfigFile } from "../../../../types";

const configFile = sample as ConfigFile;
const schema = configFile.forms[0].schema;

const mockDescriptionField = () => {
  return <div>DescriptionField</div>;
};
const mockTitleField = () => {
  return <div>TitleField</div>;
};
const mockProperties = {
  content: <div>content</div>,
  name: "name",
  disabled: false,
  readonly: false,
};

describe("customObjectFieldTemplate", () => {
  it("shouldould render all fields correctly");
  render(
    <CustomObjectFieldTemplate
      DescriptionField={mockDescriptionField}
      TitleField={mockTitleField}
      title="title"
      description="description"
      properties={[mockProperties]}
      required={false}
      schema={schema}
      uiSchema={{}}
      idSchema={{}}
      formData={{}}
      formContext={{}}
    />
  );
  expect(screen.getByTestId("")).toBeNull();

  it.todo("should render title if it exist");
  it.todo("should render all properties in a list");
});

// DescriptionField: React.StatelessComponent<{ id: string; description: string | React.ReactElement }>;
//         TitleField: React.StatelessComponent<{ id: string; title: string; required: boolean }>;
//         title: string;
//         description: string;
//         properties: {
//             content: React.ReactElement;
//             name: string;
//             disabled: boolean;
//             readonly: boolean;
//         }[];
//         required: boolean;
//         schema: JSONSchema6;
//         uiSchema: UiSchema;
//         idSchema: IdSchema;
//         formData: T;
//         formContext: any;
