import { Section } from './section';

export interface TextSection extends Section {
    text: string; // markdown
    backgroundColour: string;
    colour: string;
    align: string;
  }
  