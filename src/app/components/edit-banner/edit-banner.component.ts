import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BannerSection } from 'src/app/models/banner-section';
import { MediaService } from 'src/app/services/media.service';
import { GalleryImage } from 'src/app/models/gallery-image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss']
})
export class EditBannerComponent implements OnInit {
  @Input() section: BannerSection;
  @Output() sectionChange = new EventEmitter<BannerSection>();

  images: GalleryImage[];
  prefix = environment.storageUrl + '/images/';

  constructor(private media: MediaService) { }

  ngOnInit() {
    this.media.images.subscribe(x => {
      this.images = x;
    });
  }

  change() {
    this.sectionChange.emit(this.section);
  }

  set(img: GalleryImage) {
    this.section.image = img;
    this.change();
  }

}
