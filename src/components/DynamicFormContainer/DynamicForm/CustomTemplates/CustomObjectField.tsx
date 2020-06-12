import React, { FunctionComponent } from "react";
import { ObjectFieldTemplateProps } from "react-jsonschema-form";

export const CustomObjectFieldTemplate: FunctionComponent<ObjectFieldTemplateProps> = ({
  TitleField,
  properties,
  title,
  description,
  required,
}) => {
  return (
    <>
      {title && <TitleField title={title} id={title} required={required} />}
      <ul className="dynamicForm-items">
        {properties.map((prop, index) => (
          <li className="my-4" key={index}>
            {prop.content}
          </li>
        ))}
      </ul>
      {description}
    </>
  );
};
