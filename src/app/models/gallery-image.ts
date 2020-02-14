import { GalleryImageDetails } from './gallery-image-details';

export interface GalleryImage {
  preview_small: GalleryImageDetails;
  preview_sd: GalleryImageDetails;
  preview_hd: GalleryImageDetails;
  raw: GalleryImageDetails;
  dominantColour: string;
  id: string;

  galleryImageLoaded?: boolean;
  viewerImageLoaded?: boolean;
  srcAfterFocus?: string;

  description: string;
}

export interface Files {
  
}