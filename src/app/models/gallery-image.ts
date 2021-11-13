import { GalleryImageDetails } from './gallery-image-details';

export interface GalleryImage {
  files: { [key: string]: GalleryImageDetails };

  partitionKey: string;
  rowKey: string;
  description: string;
  dominantColour: string;

  previewSmallPath: string;
  previewSmallWidth: number;
  previewSmallHeight: number;

  previewMediumPath: string;
  previewMediumWidth: number;
  previewMediumHeight: number;

  previewLargePath: string;
  previewLargeWidth: number;
  previewLargeHeight: number;

  rawPath: string;
  rawWidth: number;
  rawHeight: number;

  galleryImageLoaded?: boolean;
  viewerImageLoaded?: boolean;
  srcAfterFocus?: string;
  active?: boolean;
  transition?: string;
}
