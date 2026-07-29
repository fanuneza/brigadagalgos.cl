// Stub for the astro:content virtual module so unit tests can import modules
// that reference getCollection. The tested helpers never call it.
export function getCollection(): never {
  throw new Error("astro:content is not available in unit tests");
}
