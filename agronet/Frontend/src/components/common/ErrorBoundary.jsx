import { Component } from "react";


class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong.</h2>
                    <p className="text-gray-600 mb-6">
                        We apologize for the inconvenience. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
                    >
                        Refresh Page
                    </button>
                    {import.meta.env.DEV && (
                        <pre className="mt-8 p-4 bg-red-50 text-red-800 rounded text-left overflow-auto max-w-2xl text-xs">
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
