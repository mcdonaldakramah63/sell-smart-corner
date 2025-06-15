
/**
 * Detect if running inside a Capacitor native app (Android/iOS).
 * Returns true if inside Capacitor.
 */
export function isCapacitor(): boolean {
  return !!(window as any).Capacitor?.isNativePlatform?.();
}
