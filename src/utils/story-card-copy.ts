const DEFAULT_MAX_STORY_CARD_CHARACTERS = 260;

export function buildCardStoryExcerpt(story: string, maxCharacters = DEFAULT_MAX_STORY_CARD_CHARACTERS): string {
  const normalized = story.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxCharacters) {
    return normalized;
  }

  const slice = normalized.slice(0, maxCharacters + 1);
  const sentenceBreak = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));

  if (sentenceBreak >= Math.floor(maxCharacters * 0.6)) {
    return slice.slice(0, sentenceBreak + 1).trim();
  }

  const wordBreak = slice.lastIndexOf(" ");
  const safeBreak = wordBreak >= Math.floor(maxCharacters * 0.75) ? wordBreak : maxCharacters;

  return `${slice.slice(0, safeBreak).trimEnd()}…`;
}
