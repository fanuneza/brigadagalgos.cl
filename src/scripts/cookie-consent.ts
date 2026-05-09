const CONSENT_COOKIE = document.documentElement.dataset.consentCookie ?? "site_consent";
const GA_MEASUREMENT_ID = document.documentElement.dataset.gaId ?? "";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const GA_SCRIPT_ID = "ga4-script";

type TrackingWindow = Window & {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
  __gaInitPromise?: Promise<void>;
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

function bootstrapAnalytics() {
  const trackingWindow = getTrackingWindow();
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag =
    trackingWindow.gtag ||
    ((...args: unknown[]) => {
      trackingWindow.dataLayer.push(args);
    });
}

function initializeAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return Promise.resolve();
  }

  const trackingWindow = getTrackingWindow();

  if (trackingWindow.__gaInitPromise) {
    return trackingWindow.__gaInitPromise;
  }

  trackingWindow.__gaInitPromise = new Promise<void>((resolve, reject) => {
    bootstrapAnalytics();

    const existingScript = document.getElementById(GA_SCRIPT_ID) as HTMLScriptElement | null;
    const finishInitialization = () => {
      bootstrapAnalytics();
      trackingWindow.gtag?.("js", new Date());
      trackingWindow.gtag?.("config", GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
      resolve();
    };

    if (existingScript) {
      finishInitialization();
      return;
    }

    const script = document.createElement("script");
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.addEventListener("load", finishInitialization, { once: true });
    script.addEventListener(
      "error",
      () => {
        trackingWindow.__gaInitPromise = undefined;
        reject(new Error("Failed to load Google Analytics"));
      },
      { once: true },
    );
    document.head.append(script);
  });

  return trackingWindow.__gaInitPromise;
}

function applyConsentState() {
  const consent = getCookie(CONSENT_COOKIE);

  if (consent === CONSENT_ACCEPTED) {
    void initializeAnalytics();
    hideBanner();
    return;
  }

  if (consent === CONSENT_REJECTED) {
    hideBanner();
    return;
  }

  showBanner();
}

function initCookieConsent() {
  applyConsentState();

  document.getElementById("cookie-accept")?.addEventListener("click", () => {
    setCookie(CONSENT_COOKIE, CONSENT_ACCEPTED);
    void initializeAnalytics();
    hideBanner();
  });

  document.getElementById("cookie-reject")?.addEventListener("click", () => {
    setCookie(CONSENT_COOKIE, CONSENT_REJECTED);
    hideBanner();
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
