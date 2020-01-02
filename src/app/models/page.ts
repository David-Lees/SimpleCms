import { Section } from './section';

export interface Page {
  name: string;
  url: string;
  sections: Section[];
}
