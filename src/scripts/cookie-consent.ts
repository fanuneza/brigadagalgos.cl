const CONSENT_COOKIE = document.documentElement.dataset.consentCookie ?? "site_consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type ConsentStorageState = "granted" | "denied";
type TrackingWindow = Window & {
  dataLayer: unknown[];
  gtag?: (...args: unknown[]) => void;
};

function getTrackingWindow() {
  const trackingWindow = window as unknown as TrackingWindow;
  trackingWindow.dataLayer = trackingWindow.dataLayer || [];
  trackingWindow.gtag =
    trackingWindow.gtag ||
    ((...args: unknown[]) => {
      trackingWindow.dataLayer.push(args);
    });

  return trackingWindow;
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

function updateConsent(storage: ConsentStorageState) {
  const trackingWindow = getTrackingWindow();
  trackingWindow.gtag?.("consent", "update", {
    analytics_storage: storage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    personalization_storage: "denied",
    security_storage: "granted",
  });
}

function applyConsentState() {
  const consent = getCookie(CONSENT_COOKIE);

  if (consent === CONSENT_ACCEPTED) {
    updateConsent("granted");
    hideBanner();
    return;
  }

  updateConsent("denied");

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
    updateConsent("granted");
    hideBanner();
  });

  document.getElementById("cookie-reject")?.addEventListener("click", () => {
    setCookie(CONSENT_COOKIE, CONSENT_REJECTED);
    updateConsent("denied");
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
