
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
          <h1>Đã xảy ra lỗi! (Something went wrong)</h1>
          <h3>{this.state.error?.toString()}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
          >
            Tải lại trang (Reload)
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
