import React, { FunctionComponent } from "react";
import { ObjectFieldTemplateProps } from "@rjsf/core";

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
        {properties.map(
          (
            prop: { content: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined },
            index: React.Key | null | undefined
          ) => (
            <li className="my-4" key={index}>
              {prop.content}
            </li>
          )
        )}
      </ul>
      {description}
    </>
  );
};
