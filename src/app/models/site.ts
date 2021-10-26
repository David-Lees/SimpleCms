import { Page } from './page';

export interface Site {
  id?: string;
  pages: Page[];
  name: string;
  headerBackground: string;
  headerColour: string;
  hasLogo: boolean;
  isExpanded?: boolean;
}
