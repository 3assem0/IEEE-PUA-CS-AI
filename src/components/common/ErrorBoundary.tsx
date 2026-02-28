import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-red-50 text-red-900">
          <div className="max-w-md w-full bg-white border border-red-200 rounded-3xl p-8 shadow-sm">
            <h2 className="serif text-2xl mb-4 text-[#393737]">Something went wrong.</h2>
            <p className="text-sm text-[#888787] mb-6 whitespace-pre-wrap">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <div className="bg-[#F7F7F7] p-4 rounded-xl mb-6 text-[10px] font-mono overflow-auto">
              Check the browser console for more details.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#393737] hover:bg-[#222] text-white py-3 rounded-full text-sm font-medium transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
