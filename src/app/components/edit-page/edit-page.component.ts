import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Page } from 'src/app/models/page';
import { GallerySection } from 'src/app/models/gallery-section';
import { TextSection } from 'src/app/models/text-section';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { BannerSection } from 'src/app/models/banner-section';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',  
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit {
  @Input() page: Page;
  @Output() pageChange = new EventEmitter<Page>();

  activeSection = 0;

  constructor() {}

  ngOnInit() {}

  change() {
    this.pageChange.emit(this.page);
  }

  select(idx: number) {
    this.activeSection = idx;
  }

  update(s: Section, idx: number) {
    Object.assign(this.page.sections[idx], s);    
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
  
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.page.sections, event.previousIndex, event.currentIndex);
  }
}
