export {};

import { buildSharedGalleryMarkup } from "./gallery/markup";
import { initSharedGalleries } from "./gallery/carousel";
import { initSharedGalleryLightbox } from "./gallery/lightbox";
import type { SharedGalleryPhoto } from "./gallery/types";
import { getInstagramHandleLabel } from "../utils/instagram";
import { dispatchAnalytics } from "../utils/analytics";
import { escapeHtml } from "../utils/html-escape";

const PAGE_SIZE = 6;

interface StoryApiRecord {
  id: string;
  name: string;
  story: string;
  instagramUrl?: string;
  photos: SharedGalleryPhoto[];
}

function initStoriesSection() {
  const root = document.querySelector<HTMLElement>("[data-stories-root]");
  const grid = document.querySelector<HTMLElement>("[data-stories-list]");
  const button = document.querySelector<HTMLButtonElement>("[data-stories-ver-mas]");

  if (!root || !grid) return;

  const endpoint = root.dataset.storiesEndpoint;
  let loaded = Number(root.dataset.storiesLoaded ?? "0");
  let allStories: StoryApiRecord[] | null = null;
  let loading = false;

  function createStoryCard(story: StoryApiRecord) {
    const safeId = escapeHtml(story.id);
    const safeName = escapeHtml(story.name);
    const safeInstagramLabel = escapeHtml(getInstagramHandleLabel(story.instagramUrl));
    const instagramLink = story.instagramUrl
      ? `
        <a
          href="${escapeHtml(story.instagramUrl)}"
          class="story-card__social dog-social-link"
          aria-label="Seguir a ${safeName} en Instagram: ${safeInstagramLabel}"
          target="_blank"
          rel="noopener noreferrer"
          data-external-indicator="off"
          data-track-event="social_click"
          data-track-category="instagram"
          data-track-outbound="true"
          data-social-platform="instagram"
          data-dog-name="${safeName}"
          data-track-location="success_stories"
          data-track-destination="${escapeHtml(story.instagramUrl)}"
        >
          <img src="/icons/instagram.svg" alt="" aria-hidden="true" />
          <span>${safeInstagramLabel}</span>
        </a>
      `
      : "";
    const article = document.createElement("article");
    article.className = "story-card";
    article.dataset.storyCard = "";
    article.dataset.storyId = story.id;
    article.dataset.storyName = story.name;
    article.dataset.storyLocation = "success_stories";
    article.innerHTML = `
      ${buildSharedGalleryMarkup({ id: story.id, name: story.name, photos: story.photos })}
      <div
        class="story-card__body"
        data-track-event="story_click"
        data-track-label="${safeName}"
        data-track-location="success_stories"
        data-story-id="${safeId}"
        data-story-name="${safeName}"
      >
        <p class="story-card__name"></p>
        <p class="story-card__quote"></p>
        ${instagramLink}
      </div>
    `;

    article.querySelector<HTMLElement>(".story-card__name")!.textContent = story.name;
    article.querySelector<HTMLElement>(".story-card__quote")!.textContent = story.story;

    return article;
  }

  function updateButtonVisibility() {
    if (!button || !allStories) {
      return;
    }

    button.hidden = loaded >= allStories.length;
  }

  async function loadStories() {
    if (allStories || loading || !endpoint) {
      return;
    }

    loading = true;

    try {
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) {
        throw new Error(`Unable to load stories: ${response.status}`);
      }

      allStories = (await response.json()) as StoryApiRecord[];
      updateButtonVisibility();
    } catch (error) {
      console.error(error);
      if (button) {
        button.disabled = true;
      }
    } finally {
      loading = false;
    }
  }

  button?.addEventListener("click", () => {
    void (async () => {
      dispatchAnalytics({
        event: "stories_load_more",
        location: "success_stories",
      });

      await loadStories();

      if (!allStories) {
        return;
      }

      const loadedIds = new Set(
        [...grid.querySelectorAll<HTMLElement>("[data-story-id]")].map((el) => el.dataset.storyId)
      );
      const nextStories = allStories.filter((story) => !loadedIds.has(story.id)).slice(0, PAGE_SIZE);
      if (!nextStories.length) {
        updateButtonVisibility();
        return;
      }

      const fragment = document.createDocumentFragment();
      nextStories.forEach((story) => {
        fragment.appendChild(createStoryCard(story));
      });
      grid.appendChild(fragment);
      initSharedGalleries(grid);
      loaded += nextStories.length;
      updateButtonVisibility();
    })();
  });

  initSharedGalleries(grid);
}

document.addEventListener("astro:page-load", () => {
  initSharedGalleryLightbox();
  initStoriesSection();
});
