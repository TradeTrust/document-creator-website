import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { MouseEventHandler, ReactElement } from "react";

interface ErrorCardProps {
  title: string;
  description: string;
  buttonProps: {
    onClick: MouseEventHandler<HTMLButtonElement>;
    text: string;
  };
}

export const ErrorCard: React.FunctionComponent<ErrorCardProps> = ({
  title,
  description,
  buttonProps,
}: ErrorCardProps) => {
  return (
    <div className="bg-red-100 px-8 py-6 rounded-xl">
      <div className="mb-8">
        <div className="text-rose font-bold mb-8" data-testid="error-title">
          {title}
        </div>
        <div>{description}</div>
      </div>
      <Button onClick={buttonProps.onClick} className="bg-white text-cerulean hover:bg-cloud-100 flex mx-auto">
        {buttonProps.text}
      </Button>
    </div>
  );
};
