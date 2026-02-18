import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              An error occurred while rendering this component.
            </p>
            <details className="text-sm text-gray-500 mb-4">
              <summary className="cursor-pointer font-medium mb-2">Error details</summary>
              <div className="mt-2 space-y-2">
                <div>
                  <strong>Error:</strong>
                  <pre className="mt-1 p-2 bg-red-50 rounded text-red-700 overflow-auto text-xs">
                    {this.state.error?.toString()}
                  </pre>
                </div>
                {this.state.errorInfo && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
