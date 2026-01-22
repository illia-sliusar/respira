import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";

interface UseAppLifecycleOptions {
  /**
   * Callback when app comes to foreground
   */
  onForeground?: () => void;

  /**
   * Callback when app goes to background
   */
  onBackground?: () => void;

  /**
   * Whether the hook is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook to handle app lifecycle state changes (foreground/background)
 *
 * @example
 * ```tsx
 * useAppLifecycle({
 *   onForeground: () => {
 *     // Refresh data when app comes to foreground
 *     queryClient.invalidateQueries({ queryKey: ['score'] });
 *   },
 *   onBackground: () => {
 *     // Cleanup when app goes to background
 *   },
 * });
 * ```
 */
export function useAppLifecycle(options: UseAppLifecycleOptions = {}) {
  const { onForeground, onBackground, enabled = true } = options;

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (!enabled) return;

      const prevState = appStateRef.current;

      // App came to foreground (from background or inactive)
      if (
        (prevState === "background" || prevState === "inactive") &&
        nextAppState === "active"
      ) {
        onForeground?.();
      }

      // App went to background
      if (prevState === "active" && nextAppState === "background") {
        onBackground?.();
      }

      appStateRef.current = nextAppState;
    },
    [enabled, onForeground, onBackground]
  );

  useEffect(() => {
    if (!enabled) return;

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [enabled, handleAppStateChange]);

  return {
    currentState: appStateRef.current,
  };
}
