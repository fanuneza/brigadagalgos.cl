export {};

const CONSENT_COOKIE = document.documentElement.dataset.consentCookie ?? "site_consent";
const GTM_CONTAINER_ID = document.documentElement.dataset.gtmId ?? "";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const GTM_SCRIPT_ID = "gtm-script";

type TrackingWindow = Window & {
  dataLayer: unknown[];
  __cookieConsentState?: "granted" | "denied";
  __gtmInitPromise?: Promise<void>;
};

function getTrackingWindow() {
  return window as unknown as TrackingWindow;
}

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax`;
}

function hideBanner() {
  document.getElementById("cookie-banner")?.setAttribute("hidden", "");
}

function showBanner() {
  document.getElementById("cookie-banner")?.removeAttribute("hidden");
}

function dispatchConsentChanged(status: "accepted" | "rejected" | "unknown") {
  document.dispatchEvent(new CustomEvent("brigada:consent-changed", { detail: { status } }));
}

function bootstrapAnalytics() {
  const trackingWindow = getTrackingWindow();
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
}

function pushConsentState(state: "granted" | "denied") {
  const trackingWindow = getTrackingWindow();
  bootstrapAnalytics();

  if (trackingWindow.__cookieConsentState === state) {
    return;
  }

  trackingWindow.__cookieConsentState = state;
  trackingWindow.dataLayer.push({
    event: "cookie_consent_update",
    analytics_storage: state,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function getExistingGtmScript() {
  return document.getElementById(GTM_SCRIPT_ID) as HTMLScriptElement | null;
}

function initializeAnalytics() {
  if (!GTM_CONTAINER_ID) {
    return Promise.resolve();
  }

  const trackingWindow = getTrackingWindow();
  bootstrapAnalytics();
  pushConsentState("granted");

  if (trackingWindow.__gtmInitPromise) {
    return trackingWindow.__gtmInitPromise;
  }

  trackingWindow.__gtmInitPromise = new Promise<void>((resolve, reject) => {
    const existingScript = getExistingGtmScript();
    const finishInitialization = () => {
      resolve();
    };

    if (existingScript) {
      finishInitialization();
      return;
    }

    const script = document.createElement("script");
    script.id = GTM_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_CONTAINER_ID)}`;
    script.addEventListener("load", finishInitialization, { once: true });
    script.addEventListener(
      "error",
      () => {
        trackingWindow.__gtmInitPromise = undefined;
        reject(new Error("Failed to load Google Tag Manager"));
      },
      { once: true }
    );
    document.head.append(script);
  });

  return trackingWindow.__gtmInitPromise;
}

function applyAcceptedConsent() {
  setCookie(CONSENT_COOKIE, CONSENT_ACCEPTED);
  dispatchConsentChanged("accepted");
  void initializeAnalytics();
  hideBanner();
}

function applyRejectedConsent() {
  setCookie(CONSENT_COOKIE, CONSENT_REJECTED);
  dispatchConsentChanged("rejected");
  bootstrapAnalytics();
  pushConsentState("denied");
  hideBanner();
}

function applyConsentState() {
  const consent = getCookie(CONSENT_COOKIE);

  if (consent === CONSENT_ACCEPTED) {
    dispatchConsentChanged("accepted");
    bootstrapAnalytics();
    void initializeAnalytics();
    hideBanner();
    return;
  }

  if (consent === CONSENT_REJECTED) {
    dispatchConsentChanged("rejected");
    bootstrapAnalytics();
    pushConsentState("denied");
    hideBanner();
    return;
  }

  dispatchConsentChanged("unknown");
  showBanner();
}

function initCookieConsent() {
  applyConsentState();

  document.getElementById("cookie-accept")?.addEventListener("click", () => {
    applyAcceptedConsent();
  });

  document.getElementById("cookie-reject")?.addEventListener("click", () => {
    applyRejectedConsent();
  });

  document.getElementById("cookie-manage-btn")?.addEventListener("click", () => {
    clearCookie(CONSENT_COOKIE);
    window.location.reload();
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieConsent, { once: true });
  } else {
    initCookieConsent();
  }
}
