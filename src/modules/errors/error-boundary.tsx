import React, { Component, type ReactNode } from "react";
import { View, Text } from "react-native";
import { Button } from "@/src/ui";
import { logError } from "./error-handler";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logError(error, {
      componentStack: errorInfo.componentStack,
      context: "ErrorBoundary",
    });
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 items-center justify-center p-xl bg-background">
          <Text className="text-2xl font-semibold mb-sm text-center">Something went wrong</Text>
          <Text className="text-base text-secondary text-center mb-md">
            An unexpected error occurred. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text className="text-xs text-error text-center mb-lg font-mono">
              {this.state.error.message}
            </Text>
          )}
          <Button
            title="Try Again"
            onPress={this.handleRetry}
            variant="primary"
            className="min-w-[150px]"
          />
        </View>
      );
    }

    return this.props.children;
  }
}
