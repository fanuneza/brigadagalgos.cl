const GTM_ID = document.documentElement.dataset.gtmId ?? "";
const CONSENT_COOKIE = document.documentElement.dataset.consentCookie ?? "site_consent";
const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function getWindowWithDataLayer() {
  return window as unknown as Window & { dataLayer: Array<Record<string, unknown>> };
}

let gtmLoaded = false;

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

function loadGtm() {
  if (!GTM_ID || gtmLoaded || document.querySelector(`script[data-gtm-id="${GTM_ID}"]`)) {
    gtmLoaded = true;
    return;
  }

  const windowWithDataLayer = getWindowWithDataLayer();
  windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || [];
  windowWithDataLayer.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  script.dataset.gtmId = GTM_ID;
  document.head.appendChild(script);
  gtmLoaded = true;
}

function applyConsentState() {
  const consent = getCookie(CONSENT_COOKIE);

  if (consent === CONSENT_ACCEPTED) {
    loadGtm();
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
    loadGtm();
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
