import { Section } from './section';
import { GalleryImage } from './gallery-image';

export interface GallerySection extends Section {
    images: GalleryImage[];
    imageMargin?: number;
    imageSize?: number;
    galleryName?: string;
    rowsPerPage?: number;
  }
  