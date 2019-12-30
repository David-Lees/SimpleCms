import { Section } from './section';

export interface Site {
  pages: Page[];
  name: string;
}

export interface Page {
  name: string;
  url: string;
  sections: Section[];
}
