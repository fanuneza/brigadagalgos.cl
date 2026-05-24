export const CONSENT_ACCEPTED = "accepted";

export function getTrackingWindow() {
  return window as Window & {
    dataLayer?: unknown[];
    __brigadaAnalyticsBound?: boolean;
    __cookieConsentState?: "granted" | "denied";
    __gtmInitPromise?: Promise<void>;
    __gtmBootstrapPushed?: boolean;
  };
}

export function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function ensureDataLayer() {
  const trackingWindow = getTrackingWindow();
  trackingWindow.dataLayer = trackingWindow.dataLayer ?? [];
  return trackingWindow.dataLayer;
}

export function dispatchAnalytics(detail: Record<string, string | number | boolean | undefined>) {
  document.dispatchEvent(new CustomEvent("brigada:analytics", { detail }));
}
