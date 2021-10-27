import { GalleryImageDetails } from './gallery-image-details';

export interface GalleryImage {
  files: { [key: string]: GalleryImageDetails };

  dominantColour: string;
  id: string;
  description: string;

  galleryImageLoaded?: boolean;
  viewerImageLoaded?: boolean;
  srcAfterFocus?: string;
}
