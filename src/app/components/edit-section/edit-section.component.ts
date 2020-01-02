import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';
import { Section } from 'src/app/models/section';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent {
  sectionTypes = SectionTypes;
  @Input() section: Section;
  @Output() sectionChange = new EventEmitter<Section>();

  constructor() {}

  get textSection(): TextSection {
    return this.section as TextSection;
  }

  set textSection(v: TextSection) {
    this.section = v;
    this.sectionChange.emit(v);
  }

  get gallerySection(): GallerySection {
    return this.section as GallerySection;
  }

  set gallerySection(v: GallerySection) {
    this.section = v;
    this.sectionChange.emit(v);
  }
}
