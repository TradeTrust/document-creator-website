import { FunctionComponent, ReactNode } from "react";

interface OnCloseGuardProps {
  children: ReactNode;
  active: boolean;
}

export const OnCloseGuard: FunctionComponent<OnCloseGuardProps> = ({ children, active }) => {
  if (active) {
    window.onbeforeunload = () => true;
  }

  return <>{children}</>;
};
