import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'An unexpected application error occurred.' };
  }

  render() {
    if (this.state.hasError) {
      let readableMessage = this.state.message;
      try {
        const parsed = JSON.parse(this.state.message) as { error?: string; operationType?: string; path?: string };
        if (parsed && parsed.error) {
          readableMessage = `${parsed.error} (${parsed.operationType || 'read'} on ${parsed.path || 'record'})`;
        }
      } catch {
        // Use raw message
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F8F4ED] p-6">
          <div className="w-full max-w-lg rounded-2xl border border-[#292323]/12 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 text-[#761D2D]">
              <AlertTriangle className="h-6 w-6 shrink-0" />
              <h2 className="font-display text-2xl font-semibold">Unable to Complete Request</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#292323]/80">{readableMessage}</p>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, message: '' });
                  window.location.href = '/';
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#761D2D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#8F2638] transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
