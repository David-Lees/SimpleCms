import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Page } from 'src/app/models/page';
import { GallerySection } from 'src/app/models/gallery-section';
import { TextSection } from 'src/app/models/text-section';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { BannerSection } from 'src/app/models/banner-section';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
})
export class EditPageComponent implements OnInit {
  @Input() page: Page;
  @Output() pageChange = new EventEmitter<Page>();

  constructor() {}

  ngOnInit() {}

  change() {
    this.pageChange.emit(this.page);
  }

  update(s: Section, idx: number) {
    //if (this.page.sections[idx] != s) {
      Object.assign(this.page.sections[idx], s);
    //}
  }

  addBanner() {
    const b: BannerSection = {
      name: SectionTypes.BannerSection,
      image: null,
    };
    this.page.sections.push(b);
    this.change();
  }

  addGallery() {
    const g: GallerySection = {
      name: SectionTypes.GallerySection,
      galleryName: 'Gallery',
      images: [],
      imageMargin: 3,
      imageSize: 200,
      rowsPerPage: 200
    };
    this.page.sections.push(g);
    this.change();
  }

  addText() {
    const t: TextSection = {
      name: SectionTypes.TextSection,
      text: '',
      backgroundColour: '#FFFFFF',
      colour: '#000000',
      align: 'left',
    };
    this.page.sections.push(t);
    this.change();
  }

  remove(x: number) {
    this.page.sections = this.page.sections.splice(x);
    this.change();
  }

  up(x: number) {
    if (x > 0) {
      this.move(x, x - 1);
      this.change();
    }
  }

  down(x: number) {
    if (x < this.page.sections.length) {
      this.move(x, x + 1);
      this.change();
    }
  }

  move(from: number, to: number) {
    const removedElement = this.page.sections.splice(from, 1)[0];
    this.page.sections.splice(to, 0, removedElement);    
  }
}
