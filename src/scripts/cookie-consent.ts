import { CONSENT_ACCEPTED, getCookie } from "../utils/analytics";

const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const GTM_SCRIPT_ID = "gtm-script";

function getConsentCookie() {
  return document.documentElement.dataset.consentCookie ?? "site_consent";
}

function getGtmContainerId() {
  return document.documentElement.dataset.gtmId ?? "";
}

type TrackingWindow = Window & {
  dataLayer: unknown[];
  __cookieConsentState?: "granted" | "denied";
  __gtmInitPromise?: Promise<void>;
  __gtmBootstrapPushed?: boolean;
};

function getTrackingWindow() {
  return window as unknown as TrackingWindow;
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

function pushGtmBootstrapEvent() {
  const trackingWindow = getTrackingWindow();
  bootstrapAnalytics();

  if (trackingWindow.__gtmBootstrapPushed) {
    return;
  }

  trackingWindow.__gtmBootstrapPushed = true;
  trackingWindow.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });
}

function getExistingGtmScript() {
  return document.getElementById(GTM_SCRIPT_ID) as HTMLScriptElement | null;
}

const PRECONNECT_ID = "consent-preconnects";
const PRECONNECT_HOSTS: { href: string; rel: "preconnect" | "dns-prefetch" }[] = [
  { href: "https://www.googletagmanager.com", rel: "preconnect" },
  { href: "https://static.cloudflareinsights.com", rel: "preconnect" },
  { href: "https://www.google-analytics.com", rel: "preconnect" },
  { href: "https://region1.google-analytics.com", rel: "dns-prefetch" },
];

function injectPreconnects() {
  if (document.getElementById(PRECONNECT_ID)) return;
  const fragment = document.createDocumentFragment();
  const marker = document.createElement("meta");
  marker.id = PRECONNECT_ID;
  marker.setAttribute("data-consent", "preconnects");
  fragment.appendChild(marker);
  PRECONNECT_HOSTS.forEach(({ href, rel }) => {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    fragment.appendChild(link);
  });
  document.head.appendChild(fragment);
}

function initializeAnalytics() {
  const GTM_CONTAINER_ID = getGtmContainerId();

  if (!GTM_CONTAINER_ID) {
    return Promise.resolve();
  }

  const trackingWindow = getTrackingWindow();
  bootstrapAnalytics();
  injectPreconnects();
  pushConsentState("granted");
  pushGtmBootstrapEvent();

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
  setCookie(getConsentCookie(), CONSENT_ACCEPTED);
  dispatchConsentChanged("accepted");
  void initializeAnalytics();
  hideBanner();
}

function applyRejectedConsent() {
  setCookie(getConsentCookie(), CONSENT_REJECTED);
  dispatchConsentChanged("rejected");
  bootstrapAnalytics();
  pushConsentState("denied");
  hideBanner();
}

function applyConsentState() {
  const consent = getCookie(getConsentCookie());

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
    document.dispatchEvent(
      new CustomEvent("brigada:analytics", {
        detail: {
          event: "cookie_consent_action",
          action: "accept",
        },
      })
    );
    applyAcceptedConsent();
  });

  document.getElementById("cookie-reject")?.addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent("brigada:analytics", {
        detail: {
          event: "cookie_consent_action",
          action: "reject",
        },
      })
    );
    applyRejectedConsent();
  });

  document.getElementById("cookie-manage-btn")?.addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent("brigada:analytics", {
        detail: {
          event: "cookie_consent_action",
          action: "manage",
        },
      })
    );
    clearCookie(getConsentCookie());
    window.location.reload();
  });
}

document.addEventListener("astro:page-load", initCookieConsent);
