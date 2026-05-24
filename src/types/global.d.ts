export {};

type DataLayerEvent = {
  event: string;
  page_path: string;
  [key: string]: string | number | boolean | undefined;
};

type AnalyticsDetail = Omit<DataLayerEvent, "page_path"> & {
  page_path?: string;
};

type ConsentStatus = "accepted" | "rejected" | "unknown";

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    __brigadaAnalyticsBound?: boolean;
    __cookieConsentState?: "granted" | "denied";
    __gtmInitPromise?: Promise<void>;
    __gtmBootstrapPushed?: boolean;
  }

  interface DocumentEventMap {
    "brigada:analytics": CustomEvent<AnalyticsDetail>;
    "brigada:consent-changed": CustomEvent<{ status: ConsentStatus }>;
  }
}
