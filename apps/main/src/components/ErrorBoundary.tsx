import { Component } from "react";

import type { ComponentType, FC, GetDerivedStateFromError, PropsWithChildren, ReactNode } from "react";

export interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode | ComponentType<{ error: unknown }>;
}

interface ErrorBoundaryState {
  error?: unknown;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {};
  }

  // eslint-disable-next-line max-len
  static getDerivedStateFromError: GetDerivedStateFromError<ErrorBoundaryProps, ErrorBoundaryState> = (error) => ({
    error,
  });

  override componentDidCatch(error: Error) {
    this.setState({ error });
  }

  override render() {
    const {
      state: { error },
      props: { fallback: Fallback, children },
    } = this;

    // eslint-disable-next-line no-nested-ternary
    return "error" in this.state ? typeof Fallback === "function" ? <Fallback error={error} /> : Fallback : children;
  }
}

export const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  <div>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {(() => {
          if (error instanceof Error) {
            return error.message;
          } else if (typeof error === "string") {
            return error;
          } else {
            return JSON.stringify(error);
          }
        })()}
      </code>
    </blockquote>
  </div>
);
