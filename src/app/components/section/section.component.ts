import { Component, OnInit, Input } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.sass'],
})
export class SectionComponent implements OnInit {
  sectionTypes = SectionTypes;

  @Input() section: Section;

  constructor() {}

  ngOnInit() {}

  get textSection(): TextSection {
    return this.section as TextSection;
  }

  get gallerySection(): GallerySection {
    return this.section as GallerySection;
  }
}
