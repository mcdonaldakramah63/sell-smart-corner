
/**
 * Simple check for Capacitor runtime.
 * Returns true if running in a Capacitor native app (Android/iOS).
 */
export function isCapacitor(): boolean {
  return !!(window as any).Capacitor?.isNativePlatform?.();
}
