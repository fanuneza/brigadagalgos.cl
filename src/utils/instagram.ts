const INSTAGRAM_FALLBACK_LABEL = "Seguir en Instagram";

export function getInstagramHandleLabel(instagramUrl?: string) {
  if (!instagramUrl) {
    return INSTAGRAM_FALLBACK_LABEL;
  }

  try {
    const url = new URL(instagramUrl);
    const handle = url.pathname
      .split("/")
      .find((segment) => segment.length > 0)
      ?.replace(/^@+/, "");

    return handle ? `@${handle}` : INSTAGRAM_FALLBACK_LABEL;
  } catch {
    return INSTAGRAM_FALLBACK_LABEL;
  }
}
