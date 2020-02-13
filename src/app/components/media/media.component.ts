import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BlobUploadService } from 'src/app/services/blob-upload.service';
import { BlobServiceClient } from '@azure/storage-blob';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';
import { MediaService } from 'src/app/services/media.service';
import { GallerySection } from 'src/app/models/gallery-section';
import { Subscription } from 'rxjs';
import { SectionTypes } from 'src/app/enums/sections';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit, OnDestroy {
  constructor(public adalService: MsAdalAngular6Service, private mediaService: MediaService) {}
  images: GallerySection;
  subscription: Subscription;

  ngOnInit() {
    this.subscription = this.mediaService.images.subscribe(x => {
      this.images = {
        images: x,
        name: SectionTypes.GallerySection,
        imageMargin: 3,
        imageSize: 7,
        galleryName: 'Media Library',
        rowsPerPage: 200,
      };
    });
    this.mediaService.load();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFileComplete(event: any) {

  }
}
