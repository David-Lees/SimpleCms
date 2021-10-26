import { BannerSection } from './banner-section';

export interface ChildrenSection extends BannerSection {
  backgroundColour: string;
  backgroundAlign?: string;
  colour: string;
}
