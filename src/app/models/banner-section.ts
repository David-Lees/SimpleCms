import { Section } from './section';
import { GalleryImage } from './gallery-image';

export interface BannerSection extends Section {
  image: GalleryImage;
}
