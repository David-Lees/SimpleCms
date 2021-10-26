import { Section } from './section';

export interface Page {
  id: string;
  name: string;
  url: string;
  sections: Section[];
  pages: Page[];
  isExpanded?: boolean;
}
