import { BannerSection } from './banner-section';

export interface TextSection extends BannerSection {
  text: string; // markdown
  backgroundColour: string;
  backgroundAlign?: string;
  colour: string;
  align: string;
}
