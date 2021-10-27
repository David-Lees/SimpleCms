import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';
import { BannerSection } from 'src/app/models/banner-section';
import { environment } from 'src/environments/environment';
import { HtmlSection } from 'src/app/models/html-section';
import { ChildrenSection } from 'src/app/models/children-section';
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  sectionTypes = SectionTypes;

  @Input() section: Section;
  @Input() page: Page;
  height = 100;

  @HostListener('window:resize')
  onResize() {
    const s = this.section as BannerSection;
    if (s && s.image && s.image.files['raw']) {
      const h = s.image.files['raw'].height;
      const w = s.image.files['raw'].width;
      const ww = window.innerWidth;
      const ar = h / w;
      this.height = ar * ww;
    }
  }

  constructor() {}

  ngOnInit() {
    this.onResize();
  }

  get childrenSection(): ChildrenSection {
    return this.section as ChildrenSection;
  }

  get htmlSection(): HtmlSection {
    return this.section as HtmlSection;
  }

  get textSection(): TextSection {
    return this.section as TextSection;
  }

  get gallerySection(): GallerySection {
    return this.section as GallerySection;
  }

  get bannerSection(): BannerSection {
    return this.section as BannerSection;
  }

  get bannerUrl(): string {
    const width = window.innerWidth;
    switch (true) {
      case width < (this.bannerSection?.image?.files['preview_small']?.width || 0):
        return `${environment.storageUrl}/images/${this.bannerSection?.image?.files['preview_small']?.path}`;
      case width < (this.bannerSection?.image?.files['preview_sd']?.width || 0):
        return `${environment.storageUrl}/images/${this.bannerSection?.image?.files['preview_sd']?.path}`;
      case width < (this.bannerSection.image?.files['preview_hd']?.width || 0):
        return `${environment.storageUrl}/images/${this.bannerSection?.image?.files['preview_hd']?.path}`;
      default:
        return `${environment.storageUrl}/images/${this.bannerSection?.image?.files['raw']?.path}`;
    }
  }

  get backgroundUrl(): string {
    if (this.bannerUrl) {
      return `url("${this.bannerUrl}")`;
    } else {
      return 'none';
    }
  }
}
