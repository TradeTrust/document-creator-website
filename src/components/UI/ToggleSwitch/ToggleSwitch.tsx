import styled from "@emotion/styled";
import React from "react";
import tw from "twin.macro";

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle?: () => void;
  className?: string;
}

export const ToggleSwitch = styled(({ className, isOn, handleToggle }: ToggleSwitchProps) => {
  return (
    <div className={className}>
      <input
        className="toggle-switch-checkbox"
        id={`toggle-switch`}
        data-testid={"toggle-switch"}
        checked={isOn}
        onChange={handleToggle}
        type="checkbox"
      />
      <label className="toggle-switch-label" htmlFor={`toggle-switch`}>
        <span className={`toggle-switch-button`} />
      </label>
    </div>
  );
})`
  .toggle-switch-checkbox {
    ${tw`h-0 w-0 invisible`}
  }

  .toggle-switch-label {
    ${tw`flex items-center justify-between cursor-pointer w-20 h-8 rounded-full relative -mt-6 ml-4`}
    ${(props) =>
      props.isOn ? tw`bg-teal-lighter` : tw`bg-pink`}
    transition: background-color 0.2s;
  }

  .toggle-switch-label .toggle-switch-button {
    ${tw`absolute w-6 h-6 rounded-full bg-white`}
    content: "";
    top: 4px;
    left: 4px;
    transition: 0.2s;
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.1);
  }

  .toggle-switch-label:before {
    content: "On";
    ${tw`text-teal font-bold pl-3 opacity-0 uppercase`}
  }

  .toggle-switch-label:after {
    content: "Off";
    ${tw`text-red font-bold pr-3 uppercase`}
  }

  .toggle-switch-checkbox:checked ~ .toggle-switch-label:after {
    opacity: 0;
  }

  .toggle-switch-checkbox:checked ~ .toggle-switch-label:before {
    opacity: 1;
  }

  .toggle-switch-checkbox:checked + .toggle-switch-label .toggle-switch-button {
    left: calc(100% - 4px);
    transform: translateX(-100%);
  }
`;
