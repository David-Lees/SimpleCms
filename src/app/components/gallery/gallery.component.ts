import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ImageService } from '../../services/image.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
import { GalleryImage } from 'src/app/models/gallery-image';
import { GallerySection } from 'src/app/models/gallery-section';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy, OnChanges {
  gallery: Array<any> = [];
  images: Array<GalleryImage> = [];
  minimalQualityCategory = 'preview_small';
  viewerSubscription: Subscription;
  rowIndex = 0;
  rightArrowInactive = false;
  leftArrowInactive = false;

  @Input() sourceData: GallerySection;
  @Input() imageMargin = 3;
  @Input() imageSize = 7;
  @Input() galleryName = '';
  @Input() rowsPerPage = 200;
  @Input() isAdmin = false;

  @Output() viewerChange = new EventEmitter<boolean>();

  @ViewChild('galleryContainer', { static: true }) galleryContainer: ElementRef;
  @ViewChildren('imageElement') imageElements: QueryList<any>;

  @HostListener('window:scroll', ['$event']) triggerCycle(event: any): void {
    this.scaleGallery();
  }

  @HostListener('window:resize', ['$event']) windowResize(event: any): void {
    this.render();
  }

  constructor(public imageService: ImageService, public http: HttpClient, public changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchDataAndRender();
    this.viewerSubscription = this.imageService.showImageViewerChanged$.subscribe((visibility: boolean) =>
      this.viewerChange.emit(visibility)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    // input params changed
    if (changes.sourceData !== undefined) {
      this.fetchDataAndRender();
    } else {
      this.render();
    }
  }

  ngOnDestroy(): void {
    if (this.viewerSubscription) {
      this.viewerSubscription.unsubscribe();
    }
  }

  openImageViewer(img: any): void {
    this.imageService.updateImages(this.images);
    this.imageService.updateSelectedImageIndex(this.images.indexOf(img));
    this.imageService.showImageViewer(true);
  }

  /**
   * direction (-1: left, 1: right)
   */
  navigate(direction: number): void {
    if ((direction === 1 && this.rowIndex < this.gallery.length - this.rowsPerPage) || (direction === -1 && this.rowIndex > 0)) {
      this.rowIndex += this.rowsPerPage * direction;
    }
    this.refreshNavigationErrorState();
  }

  calcImageMargin(): number {
    const galleryWidth = this.getGalleryWidth();
    const ratio = galleryWidth / 1920;
    return Math.round(Math.max(1, this.imageMargin * ratio));
  }

  private fetchDataAndRender(): void {
    if (this.sourceData && this.sourceData.images) {
      this.images = this.sourceData.images;
    } else {
      this.images = [];
    }
    this.imageService.updateImages(this.images);
    this.images.forEach(image => {
      image.galleryImageLoaded = false;
      image.viewerImageLoaded = false;
      image.srcAfterFocus = '';
    });
    // twice, single leads to different strange browser behaviour
    this.render();
    this.render();
  }

  private render(): void {
    this.gallery = [];

    let tempRow = [this.images[0]];
    let currentRowIndex = 0;
    let i = 0;

    for (i; i < this.images.length; i++) {
      while (this.images[i + 1] && this.shouldAddCandidate(tempRow, this.images[i + 1])) {
        i++;
      }
      if (this.images[i + 1]) {
        tempRow.pop();
      }
      this.gallery[currentRowIndex++] = tempRow;
      tempRow = [this.images[i + 1]];
    }
    this.scaleGallery();
  }

  private shouldAddCandidate(imgRow: Array<any>, candidate: any): boolean {
    const oldDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);
    imgRow.push(candidate);
    const newDifference = this.calcIdealHeight() - this.calcRowHeight(imgRow);

    return Math.abs(oldDifference) > Math.abs(newDifference);
  }

  private calcRowHeight(imgRow: Array<any>): number {
    const originalRowWidth = this.calcOriginalRowWidth(imgRow);

    const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;
    const rowHeight = imgRow[0][this.minimalQualityCategory].height * ratio;

    return rowHeight;
  }

  private calcOriginalRowWidth(imgRow: Array<any>): number {
    let originalRowWidth = 0;
    imgRow.forEach(img => {
      img[this.minimalQualityCategory] = img[this.minimalQualityCategory] || { width: 1, height: 1 };
      const individualRatio = this.calcIdealHeight() / img[this.minimalQualityCategory].height;
      img[this.minimalQualityCategory].width = img[this.minimalQualityCategory].width * individualRatio;
      img[this.minimalQualityCategory].height = this.calcIdealHeight();
      originalRowWidth += img[this.minimalQualityCategory].width;
    });

    return originalRowWidth;
  }

  private calcIdealHeight(): number {
    return this.getGalleryWidth() / (80 / this.imageSize) + 100;
  }

  private getGalleryWidth(): number {
    if (this.galleryContainer.nativeElement.clientWidth === 0) {
      // for IE11
      return this.galleryContainer.nativeElement.scrollWidth;
    }
    return this.galleryContainer.nativeElement.clientWidth;
  }

  private scaleGallery(): void {
    let imageCounter = 0;
    let maximumGalleryImageHeight = 0;

    this.gallery.slice(this.rowIndex, this.rowIndex + this.rowsPerPage).forEach(imgRow => {
      const originalRowWidth = this.calcOriginalRowWidth(imgRow);

      if (imgRow !== this.gallery[this.gallery.length - 1]) {
        const ratio = (this.getGalleryWidth() - (imgRow.length - 1) * this.calcImageMargin()) / originalRowWidth;

        imgRow.forEach((img: any) => {
          img.width = img[this.minimalQualityCategory].width * ratio;
          img.height = img[this.minimalQualityCategory].height * ratio;
          maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img.height);
          this.checkForAsyncLoading(img, imageCounter++);
        });
      } else {
        imgRow.forEach((img: any) => {
          img.width = img[this.minimalQualityCategory].width;
          img.height = img[this.minimalQualityCategory].height;
          maximumGalleryImageHeight = Math.max(maximumGalleryImageHeight, img.height);
          this.checkForAsyncLoading(img, imageCounter++);
        });
      }
    });

    this.minimalQualityCategory = maximumGalleryImageHeight > 375 ? 'preview_sd' : 'preview_small';
    this.refreshNavigationErrorState();

    this.changeDetectorRef.detectChanges();
  }

  private checkForAsyncLoading(image: any, imageCounter: number): void {    
    const imageElements = (this.imageElements || new QueryList<any>()).toArray();
    if (image.galleryImageLoaded || (imageElements.length > 0 && imageElements[imageCounter])) {
      image.galleryImageLoaded = true;
      image.srcAfterFocus = environment.storageUrl + '/images/' + image[this.minimalQualityCategory].path;
    } else {
      image.srcAfterFocus = '';
    }
  }

  private refreshNavigationErrorState(): void {
    this.leftArrowInactive = this.rowIndex === 0;
    this.rightArrowInactive = this.rowIndex > this.gallery.length - this.rowsPerPage;
  }
}
