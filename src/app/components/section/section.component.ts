import { Component, OnInit, Input, HostListener } from '@angular/core';
import { SectionTypes } from 'src/app/enums/sections';
import { Section } from 'src/app/models/section';
import { TextSection } from 'src/app/models/text-section';
import { GallerySection } from 'src/app/models/gallery-section';
import { BannerSection } from 'src/app/models/banner-section';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
      this.height = (w / ww) * h;
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
    return `url(${environment.storageUrl}/images/${this.bannerSection.image.raw.path})`;
  }
}
