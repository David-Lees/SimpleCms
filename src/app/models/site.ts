import { Page } from './page';

export interface Site {
  pages: Page[];
  name: string;
  headerBackground: string;
  headerColour: string;
  hasLogo: boolean;
}
