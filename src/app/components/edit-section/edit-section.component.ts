import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';
import { Section } from 'src/app/models/section';
import { BannerSection } from 'src/app/models/banner-section';
import { HtmlSection } from 'src/app/models/html-section';
import { ChildrenSection } from 'src/app/models/children-section';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
})
export class EditSectionComponent {
  sectionTypes = SectionTypes;
  @Input() section: Section;
  @Output() sectionChange = new EventEmitter<Section>();

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

  get bannerSection(): BannerSection {
    return this.section as BannerSection;
  }

  set bannerSection(v: BannerSection) {
    this.section = v;
    this.sectionChange.emit(v);
  }

  get htmlSection(): HtmlSection {
    return this.section as HtmlSection;
  }

  set htmlSection(v: HtmlSection) {
    this.section = v;
    this.sectionChange.emit(v);
  }

  get childrenSection(): ChildrenSection {
    return this.section as ChildrenSection;
  }

  set childrenSection(v: ChildrenSection) {
    this.section = v;
    this.sectionChange.emit(v);
  }
}
