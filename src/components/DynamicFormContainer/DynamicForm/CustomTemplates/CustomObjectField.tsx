import React, { ReactElement } from "react";
import { ObjectFieldTemplateProps } from "react-jsonschema-form";

export const CustomObjectFieldTemplate = ({
  TitleField,
  properties,
  title,
  description,
  required,
}: // eslint-disable-next-line  @typescript-eslint/no-explicit-any
ObjectFieldTemplateProps<any>): ReactElement => {
  return (
    <>
      {title && <TitleField title={title} id={title} required={required} />}
      <ul className="dynamicForm-items">
        {properties.map((prop) => (
          <li className="my-4" key={prop.content.key ?? undefined}>
            {prop.content}
          </li>
        ))}
      </ul>
      {description}
    </>
  );
};
