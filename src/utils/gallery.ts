export interface SharedGalleryPhoto {
  cardAvifSrcSet?: string;
  cardSizes: string;
  cardFallbackSrc: string;
  lightbox: string;
  alt?: string;
  caption?: string;
}

export interface SharedGalleryItem {
  id?: string;
  name: string;
  photos: SharedGalleryPhoto[];
}

export function getPhotoAlt(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.alt ?? `${item.name}, foto ${index + 1}`;
}

export function getPhotoCaption(item: SharedGalleryItem, index: number) {
  return item.photos[index]?.caption ?? `${item.name} · Foto ${index + 1} de ${item.photos.length}`;
}

export function serializeGalleryPayload(item: SharedGalleryItem) {
  return JSON.stringify(item);
}
