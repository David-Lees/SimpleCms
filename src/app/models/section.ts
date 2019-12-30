export interface Section {
  name: string;
}

export interface TextSection extends Section {
  text: string; // markdown
  backgroundColour: string;
  colour: string;
  align: string;
}

export interface GallerySection extends Section {
  images: GalleryImage[];
}

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

export interface GalleryImageDetails {
  path: string;
  width: number;
  height: number;
}
