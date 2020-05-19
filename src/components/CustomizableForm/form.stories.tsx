import { JSONSchema7 } from "json-schema";
import Form from "@rjsf/core";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";

const schema: JSONSchema7 = {
  title: "Todo",
  type: "object",
  required: ["title"],
  properties: {
    title: { type: "string", title: "Title", default: "A new task" },
    done: { type: "boolean", title: "Done?", default: false },
    obj: {
      type: "object",
      properties: {
        name: { type: "string", title: "Title", default: "A new task" },
        age: { type: "string", title: "Title", default: "A new task" },
      },
    },
    lines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          value: {
            type: "number",
          },
        },
      },
    },
  },
};

const CustomizableForm = () => {
  const [formData, setFormData] = useState<any>();
  return (
    <>
      <Form
        schema={schema}
        formData={formData}
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={console.log}
        onError={() => console.log("errors")}
      />
      <div onClick={() => setFormData({})}>Click</div>
    </>
  );
};

export default {
  title: "CustomizableForm",
  component: CustomizableForm,
  parameters: {
    info: { inline: true, header: false },
  },
};

export const Default = () => <CustomizableForm />;

// const console.log = (type) => console.log.bind(console, type);

// ReactDOM.render((
//   <Form schema={schema}
//         onChange={log("changed")}
//         onSubmit={log("submitted")}
//         onError={log("errors")} />
// ), document.getElementById("app"));
