import React, { Component, ErrorInfo, ReactNode } from 'react';
import testIds from '@shared/testids';
import { IClientLogger } from '@shared/types';

interface Props {
  children: ReactNode;
  logger: IClientLogger;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { props } = this;
    props.logger.error(`[ErrorBoundary error] ${error.message}\n${errorInfo.componentStack}`);
  }

  public render(): ReactNode {
    const { props, state } = this;
    if (state.hasError) {
      return <h1 data-testid={testIds.ERROR_BOUNDARY_MESSAGE}>Something went wrong.</h1>;
    }
    return props.children;
  }
}
