import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Algo deu errado</h2>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          {this.state.error && (
            <pre className="text-xs bg-muted p-3 rounded mb-4 max-w-md overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Recarregar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
