import React, { ReactElement } from "react";
import { ObjectFieldTemplateProps } from "react-jsonschema-form";

export const CustomObjectFieldTemplate = ({
  TitleField,
  properties,
  title,
  description,
  required,
}: ObjectFieldTemplateProps<any>): ReactElement => {
  return (
    <>
      {title && <TitleField title={title} id={title} required={required} />}
      <ul className="dynamicForm-items">
        {properties.map((prop: any) => (
          <li className="my-4" key={prop.content.key}>
            {prop.content}
          </li>
        ))}
      </ul>
      {description}
    </>
  );
};
