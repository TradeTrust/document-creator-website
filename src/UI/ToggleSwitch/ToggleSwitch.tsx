import styled from "@emotion/styled";
import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle?: () => void;
  className?: string;
}

export const ToggleSwitch = styled(({ className, isOn }: ToggleSwitchProps) => {
  return (
    <div className={className}>
      <input className="react-switch-checkbox" id={`react-switch-new`} type="checkbox" />
      <label className="react-switch-label" htmlFor={`react-switch-new`}>
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
})`
  .react-switch-checkbox {
    height: 0;
    width: 0;
    visibility: hidden;
  }

  .react-switch-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 72px;
    height: 32px;
    background: ${(props) => (props.isOn ? "green" : "red")};
    border-radius: 50px;
    position: relative;
    transition: background-color 0.2s;
  }

  .react-switch-label .react-switch-button {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 24px;
    height: 24px;
    border-radius: 24px;
    transition: 0.2s;
    background: #fff;
    box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
  }

  .react-switch-checkbox:checked + .react-switch-label .react-switch-button {
    left: calc(100% - 4px);
    transform: translateX(-100%);
  }
`;
