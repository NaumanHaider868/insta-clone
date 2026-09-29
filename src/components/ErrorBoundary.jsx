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
    console.error("Unhandled application error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#0b0b0b] px-4 py-8 text-[#f5f5f5]">
          <section className="w-full max-w-md rounded-2xl border border-[#363636] bg-[#1c1c1c] p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <h1 className="mb-3 text-2xl font-semibold text-white">Something went wrong</h1>
            <p className="mb-6 text-sm text-[#a8a8a8]">
              The app hit an unexpected error. Please refresh the page or return home.
            </p>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#4c77e2] px-6 text-sm font-semibold text-white transition hover:bg-[#3f68d2]"
            >
              Go to home
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
