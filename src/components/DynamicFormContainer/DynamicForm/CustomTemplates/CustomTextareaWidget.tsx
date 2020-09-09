import React, { ChangeEvent, FunctionComponent } from "react";
import { WidgetProps } from "react-jsonschema-form";

export const CustomTextareaWidget: FunctionComponent<WidgetProps> = ({
  id,
  options,
  placeholder,
  value,
  required,
  disabled,
  readonly,
  autofocus,
  onChange,
  onBlur,
  onFocus,
}) => {
  const _onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };

  return (
    <textarea
      id={id}
      className="form-control border border-solid border-grey-lighter w-full sm:w-8/12 px-0 sm:px-2 rounded-none border border-solid border-grey-lighter"
      value={value ? value : ""}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      readOnly={readonly}
      autoFocus={autofocus}
      rows={8}
      onBlur={onBlur && ((event) => onBlur(id, event.target.value))}
      onFocus={onFocus && ((event) => onFocus(id, event.target.value))}
      onChange={_onChange}
    />
  );
};
