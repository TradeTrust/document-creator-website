import { Component, ReactNode } from "react";
import { getLogger } from "../../utils/logger";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";

const { stack } = getLogger("component:errorBoundary");

type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<unknown, State> {
  constructor(props: Record<string, unknown>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error): void {
    stack(error);
  }

  render(): ReactNode {
    const error = this.state.error;
    return this.state.hasError ? <ErrorBoundaryContent error={error?.message} /> : this.props.children;
  }
}
