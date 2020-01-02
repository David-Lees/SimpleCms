import { GalleryImageDetails } from './gallery-image-details';

export interface GalleryImage {
    preview_xxs: GalleryImageDetails;
    preview_xs: GalleryImageDetails;
    preview_s: GalleryImageDetails;
    preview_m: GalleryImageDetails;
    preview_l: GalleryImageDetails;
    preview_xl: GalleryImageDetails;
    raw: GalleryImageDetails;
    dominantColour: string;
    id: string;
  
    galleryImageLoaded?: boolean;
    viewerImageLoaded?: boolean;
    srcAfterFocus?: string;
  }
  