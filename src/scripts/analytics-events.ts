import { CONSENT_ACCEPTED, getCookie, ensureDataLayer, getTrackingWindow } from "../utils/analytics";

function getConsentCookieName() {
  return document.documentElement.dataset.consentCookie ?? "site_consent";
}

const SECTION_SELECTOR = "[data-track-section]";
const TRACKED_CLICK_SELECTOR = "[data-track-event]";
const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

type Primitive = string | number | boolean;

type DataLayerEvent = {
  event: string;
  page_path: string;
  [key: string]: Primitive | undefined;
};

type AnalyticsDetail = Omit<DataLayerEvent, "page_path"> & {
  page_path?: string;
};

type ConsentStatus = "accepted" | "rejected" | "unknown";

let sectionObserver: IntersectionObserver | null = null;
let scrollListenerAttached = false;
let resizeListenerAttached = false;
let scrollTicking = false;
const seenSections = new Set<string>();
const seenScrollMilestones = new Set<number>();

function getConsentStatus(): ConsentStatus {
  const consent = getCookie(getConsentCookieName());

  if (consent === CONSENT_ACCEPTED) {
    return "accepted";
  }

  if (consent === "rejected") {
    return "rejected";
  }

  return "unknown";
}

function hasAcceptedConsent() {
  return getConsentStatus() === "accepted";
}

function getPagePath() {
  return window.location.pathname;
}

function normalizeText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function getElementLabel(element: HTMLElement) {
  return normalizeText(
    element.dataset.trackLabel ??
      element.getAttribute("aria-label") ??
      element.textContent ??
      element.getAttribute("title")
  );
}

function sanitizeUrl(urlValue: string | null | undefined) {
  if (!urlValue) {
    return undefined;
  }

  try {
    const url = new URL(urlValue, window.location.origin);

    if (url.search || url.hash) {
      return undefined;
    }

    return url.origin === window.location.origin ? url.pathname : url.toString();
  } catch {
    return undefined;
  }
}

function getDestinationUrl(element: HTMLElement) {
  return sanitizeUrl(element.dataset.trackDestination ?? element.getAttribute("href"));
}

function pushAnalyticsEvent(payload: AnalyticsDetail) {
  if (!hasAcceptedConsent() || !payload.event) {
    return;
  }

  const eventPayload: DataLayerEvent = {
    event: String(payload.event),
    ...payload,
    page_path: payload.page_path ?? getPagePath(),
  };

  ensureDataLayer().push(eventPayload);
}

function buildTrackedClickPayload(element: HTMLElement): AnalyticsDetail {
  const payload: AnalyticsDetail = {
    event: element.dataset.trackEvent ?? "interaction",
    event_label: getElementLabel(element) || undefined,
    event_location: normalizeText(element.dataset.trackLocation) || undefined,
    page_path: getPagePath(),
  };

  const category = normalizeText(element.dataset.trackCategory);
  if (category) {
    payload.event_category = category;
  }

  const destinationUrl = getDestinationUrl(element);
  if (destinationUrl) {
    payload.destination_url = destinationUrl;
  }

  const storyId = normalizeText(element.dataset.storyId);
  if (storyId) {
    payload.story_id = storyId;
  }

  const storyName = normalizeText(element.dataset.storyName);
  if (storyName) {
    payload.story_name = storyName;
  }

  if (element.dataset.trackOutbound === "true") {
    payload.outbound = true;
  }

  // Parse custom parameters dynamically from dataset (e.g. data-dog-name -> dogName -> dog_name)
  const customParams = [
    "dogName",
    "applicationFormUrl",
    "copiedField",
    "whatsappLocation",
    "whatsappText",
    "donationLocation",
    "socialPlatform",
    "filterCategory",
  ];
  customParams.forEach((param) => {
    const value = element.dataset[param];
    if (value !== undefined) {
      const snakeKey = param.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      payload[snakeKey] = normalizeText(value) || undefined;
    }
  });

  return payload;
}

function handleTrackedClick(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const clickedAnchor = target.closest<HTMLAnchorElement>("a[href]");
  if (clickedAnchor && !event.isTrusted) {
    event.preventDefault();
  }

  const trackedElement = target.closest<HTMLElement>(TRACKED_CLICK_SELECTOR);
  if (trackedElement) {
    pushAnalyticsEvent(buildTrackedClickPayload(trackedElement));
    return;
  }

  const link = target.closest<HTMLAnchorElement>('a[target="_blank"]');
  if (!link || link.closest(TRACKED_CLICK_SELECTOR)) {
    return;
  }

  let url: URL;
  try {
    url = new URL(link.href, window.location.origin);
  } catch {
    return;
  }

  if (url.origin === window.location.origin) {
    return;
  }

  pushAnalyticsEvent({
    event: "outbound_click",
    event_label: getElementLabel(link) || undefined,
    event_location: normalizeText(link.dataset.trackLocation) || undefined,
    link_domain: url.hostname,
    link_text: getElementLabel(link) || undefined,
    link_url: sanitizeUrl(link.href),
  });
}

function getSectionThreshold(entry: IntersectionObserverEntry) {
  return entry.boundingClientRect.height <= window.innerHeight ? 0.5 : 0.3;
}

function handleSectionEntries(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    const section = entry.target as HTMLElement;
    const sectionName = normalizeText(section.dataset.trackSection);
    if (!sectionName || seenSections.has(sectionName)) {
      return;
    }

    const isVisibleEnough =
      entry.intersectionRatio >= getSectionThreshold(entry) ||
      (entry.isIntersecting &&
        entry.boundingClientRect.height > window.innerHeight &&
        entry.intersectionRect.height >= window.innerHeight * 0.6);

    if (!isVisibleEnough) {
      return;
    }

    seenSections.add(sectionName);
    pushAnalyticsEvent({
      event: "section_view",
      section_name: sectionName,
      threshold: 50,
    });
    sectionObserver?.unobserve(section);
  });
}

function startSectionTracking() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  sectionObserver?.disconnect();
  sectionObserver = new IntersectionObserver(handleSectionEntries, {
    threshold: [0, 0.3, 0.5, 0.75, 1],
  });

  document.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((section) => {
    const sectionName = normalizeText(section.dataset.trackSection);
    if (!seenSections.has(sectionName)) {
      sectionObserver?.observe(section);
    }
  });
}

function evaluateScrollDepth() {
  scrollTicking = false;

  if (!hasAcceptedConsent()) {
    return;
  }

  const doc = document.documentElement;
  const maxScroll = doc.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) {
    return;
  }

  const scrollPercent = Math.round((window.scrollY / maxScroll) * 100);
  SCROLL_MILESTONES.forEach((milestone) => {
    if (scrollPercent < milestone || seenScrollMilestones.has(milestone)) {
      return;
    }

    seenScrollMilestones.add(milestone);
    pushAnalyticsEvent({
      event: "scroll_depth",
      percent: milestone,
    });
  });
}

function queueScrollDepthEvaluation() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(evaluateScrollDepth);
}

function startScrollTracking() {
  if (!scrollListenerAttached) {
    document.addEventListener("scroll", queueScrollDepthEvaluation, { passive: true });
    scrollListenerAttached = true;
  }

  if (!resizeListenerAttached) {
    window.addEventListener("resize", queueScrollDepthEvaluation, { passive: true });
    resizeListenerAttached = true;
  }

  queueScrollDepthEvaluation();
}

function handleAnalyticsEvent(event: CustomEvent<AnalyticsDetail>) {
  if (!event.detail?.event) {
    return;
  }

  pushAnalyticsEvent(event.detail);
}

function activateConsentAwareTracking() {
  if (!hasAcceptedConsent()) {
    return;
  }

  startSectionTracking();
  startScrollTracking();
}

function bindAnalytics() {
  const trackingWindow = getTrackingWindow();
  if (trackingWindow.__brigadaAnalyticsBound) {
    activateConsentAwareTracking();
    return;
  }

  trackingWindow.__brigadaAnalyticsBound = true;
  ensureDataLayer();

  document.addEventListener("click", handleTrackedClick);
  document.addEventListener("brigada:analytics", handleAnalyticsEvent as EventListener);
  document.addEventListener("brigada:consent-changed", () => {
    activateConsentAwareTracking();
  });

  activateConsentAwareTracking();
}

document.addEventListener("astro:page-load", () => {
  // Reset per-page tracking state on each navigation so section views and
  // scroll milestones fire fresh on every page.
  seenSections.clear();
  seenScrollMilestones.clear();
  bindAnalytics();
});
