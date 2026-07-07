import { dispatchAnalytics } from "../utils/analytics";

function initShareButtons(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-share-dog]").forEach((button) => {
    button.addEventListener("click", async () => {
      const name = button.dataset.shareDog ?? "";
      const url = window.location.href;
      dispatchAnalytics({ event: "dog_share_click", dog_name: name, page_url: url });

      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: `Conoce a ${name}, un galgo en adopción con Brigada Galgos`,
            url,
          });
        } catch {
          // The person closed the share sheet; nothing to do.
        }
        return;
      }

      try {
        await navigator.clipboard.writeText(url);
        const live = document.querySelector<HTMLElement>("[data-share-live]");
        if (live) live.textContent = "Enlace copiado. Compártelo donde quieras.";
      } catch {
        // Clipboard unavailable; the URL bar remains the fallback.
      }
    });
  });
}

document.addEventListener("astro:page-load", initShareButtons);
