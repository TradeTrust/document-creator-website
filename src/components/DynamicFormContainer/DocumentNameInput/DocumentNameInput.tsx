import { ChangeEventHandler, FunctionComponent } from "react";

interface DocumentNameInputProps {
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isBorderedBottom?: boolean;
}

export const DocumentNameInput: FunctionComponent<DocumentNameInputProps> = ({
  value = "",
  onChange,
  isBorderedBottom = false,
}) => {
  return (
    <div className={isBorderedBottom ? `mb-8 pb-8 border-b border-cloud-200` : ""}>
      <label>Document Name</label>
      <input
        onChange={onChange}
        data-testid="file-name-input"
        type="text"
        aria-label="file-name-input"
        value={value}
        className={`border border-cloud-200 h-10 w-full rounded-lg px-3`}
      />
    </div>
  );
};
