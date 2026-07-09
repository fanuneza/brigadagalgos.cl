const WORDS_PER_MINUTE = 200;

export function getReadingMinutes(body: string | undefined): number {
  const wordCount = body ? body.trim().split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export function getReadingTimeLabel(body: string | undefined): string {
  const minutes = getReadingMinutes(body);
  return `${minutes} min de lectura`;
}
