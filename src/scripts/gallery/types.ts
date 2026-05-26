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
