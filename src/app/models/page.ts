import { Section } from './section';

export interface Page {
  id: string;
  name: string;
  url: string;
  sections: Section[];
  pages: Page[];
}

export class TreePage {
  constructor(
    public expandable: boolean,
    public page: Page,
    public level: number,
    public id: string
  ) {}
}