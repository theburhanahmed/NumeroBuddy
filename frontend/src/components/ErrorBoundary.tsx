import React, { Component } from 'react';
import { ErrorPage } from '../pages/ErrorPage';
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
/**
 * Enhanced Error Boundary with cosmic-themed error page
 * Catches React errors and displays user-friendly message
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Log to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {

      // window.Sentry?.captureException(error, { extra: errorInfo })
    }}
  private resetError = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };
  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <ErrorPage
          error={this.state.error || undefined}
          resetError={this.resetError} />);


    }
    return this.props.children;
  }
}