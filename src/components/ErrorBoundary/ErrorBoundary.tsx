import React, { Component, ReactNode } from "react";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";
import { getLogger } from "../../utils/logger";

const { error: errorLogger } = getLogger("component:errorboundary");

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<unknown, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    errorLogger(error);
  }

  render(): ReactNode {
    const error = this.state.error;
    console.log(error);

    return this.state.hasError ? (
      <ErrorBoundaryContent error={error?.stack} />
    ) : (
      this.props.children
    );
  }
}
