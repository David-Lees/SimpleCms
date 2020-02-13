import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';
import { BannerSection } from 'src/app/models/banner-section';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  sectionTypes = SectionTypes;

  @Input() section: Section;
  height = 100;

  @HostListener('window:resize')
  onResize() {
    const s = this.section as BannerSection;
    if (s && s.image && s.image.raw) {
      const h = s.image.raw.height;
      const w = s.image.raw.width;
      const ww = window.innerWidth;
      const ar = h / w;
      this.height = ar * ww;
    }
  }

  constructor() {}

  ngOnInit() {
    this.onResize();
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
      case width < this.bannerSection.image.preview_xxs.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_xxs.path}`;
      case width < this.bannerSection.image.preview_xs.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_xs.path}`;
      case width < this.bannerSection.image.preview_s.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_s.path}`;
      case width < this.bannerSection.image.preview_m.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_m.path}`;
      case width < this.bannerSection.image.preview_l.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_l.path}`;
      case width < this.bannerSection.image.preview_xl.width:
        return `${environment.storageUrl}/images/${this.bannerSection.image.preview_xl.path}`;
      default:
        return `${environment.storageUrl}/images/${this.bannerSection.image.raw.path}`;
    }
  }
}
