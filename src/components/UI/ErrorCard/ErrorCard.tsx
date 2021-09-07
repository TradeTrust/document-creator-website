import { Button } from "@govtechsg/tradetrust-ui-components";
import React, { ReactElement } from "react";

interface ErrorCardProps {
  title: string;
  description: string;
  buttonLink: ReactElement;
}

export const ErrorCard: React.FunctionComponent<ErrorCardProps> = ({
  title,
  description,
  buttonLink,
}: ErrorCardProps) => {
  return (
    <div className="bg-red-100 px-8 py-6 rounded-xl">
      <div className="mb-8">
        <div className="text-rose font-bold mb-8" data-testid="error-title">
          {title}
        </div>
        <div>{description}</div>
      </div>
      <Button className="bg-white hover:bg-cloud-100 flex mx-auto">{buttonLink}</Button>
    </div>
  );
};
