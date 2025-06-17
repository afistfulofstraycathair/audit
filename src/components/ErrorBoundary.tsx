import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you would send this to an error reporting service
    this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error reporting service (e.g., Sentry)
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store locally for now
    try {
      const errors = JSON.parse(
        localStorage.getItem("audit_app_errors") || "[]"
      );
      errors.push(errorData);
      localStorage.setItem(
        "audit_app_errors",
        JSON.stringify(errors.slice(-10))
      ); // Keep last 10 errors
    } catch (e) {
      console.error("Failed to log error:", e);
    }
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">
              <AlertTriangle size={48} />
            </div>
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              We're sorry, but something unexpected happened. Your data has been
              saved automatically.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                className="action-button primary"
                onClick={this.handleReset}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                className="action-button secondary"
                onClick={this.handleRefresh}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
