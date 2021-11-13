import { Component, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';
import { Page } from 'src/app/models/page';
import { GallerySection } from 'src/app/models/gallery-section';
import { TextSection } from 'src/app/models/text-section';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { BannerSection } from 'src/app/models/banner-section';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { HtmlSection } from 'src/app/models/html-section';
import { ChildrenSection } from 'src/app/models/children-section';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AdminSortSectionsComponent } from '../admin-sort-sections/admin-sort-sections.component';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
})
export class EditPageComponent implements OnInit, OnChanges {
  @Input() page: Page;
  @Output() pageChange = new EventEmitter<Page>();

  activeSection: Section;

  constructor(private _bottomSheet: MatBottomSheet) {}

  sectionDescription(s: Section) {
    const text = (s as HtmlSection).html || '' || (s as TextSection).text || '';
    return text.length > 80 ? text.substring(0, 80) + '...' : text;
  }

  ngOnInit() {
    if (this.page && this.page.sections && this.page.sections.length) {
      this.activeSection = this.page.sections[0];
    }
  }

  ngOnChanges() {
    this.activeSection = null;
  }

  change() {
    this.pageChange.emit(this.page);
  }

  select(idx: number) {
    this.activeSection = this.page.sections[idx];
  }

  update(s: Section) {
    const idx = this.page.sections.findIndex(x => x === this.activeSection);
    if (idx >= 0) {
      Object.assign(this.page.sections[idx], s);
      this.change();
    }
  }

  addChildren() {
    const c: ChildrenSection = {
      name: SectionTypes.ChildrenSection,
      backgroundColour: '#FFFFFF',
      colour: '#000000',
      backgroundAlign: 'center center',
    };
    this.page.sections.push(c);
    this.change();
  }

  addBanner() {
    const b: BannerSection = {
      name: SectionTypes.BannerSection,
      image: null,
    };
    this.page.sections.push(b);
    this.change();
  }

  addHtml() {
    const h: HtmlSection = {
      name: SectionTypes.HtmlSection,
      html: '',
    };
    this.page.sections.push(h);
    this.change();
  }

  addGallery() {
    const g: GallerySection = {
      name: SectionTypes.GallerySection,
      galleryName: 'Gallery',
      images: [],
      imageMargin: 3,
      imageSize: 7,
      rowsPerPage: 200,
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

  remove() {
    if (this.activeSection && confirm('Are you sure you want to remove this section?')) {
      const idx = this.page.sections.findIndex(x => x === this.activeSection);
      if (idx >= 0) {
        this.page.sections.splice(idx, 1);
        this.change();
      }
    }
  }

  sortSections() {
    this._bottomSheet.open(AdminSortSectionsComponent, { data: this.page });
  }
}
