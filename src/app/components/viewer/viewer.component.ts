import { ImageService } from '../../services/image.service';
import { Component, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { MediaService } from 'src/app/services/media.service';
import { GalleryImage } from 'src/app/models/gallery-image';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  animations: [
    trigger('imageTransition', [
      state(
        'enterFromRight',
        style({
          opacity: 1,
          transform: 'translate(0px, 0px)',
        })
      ),
      state(
        'enterFromLeft',
        style({
          opacity: 1,
          transform: 'translate(0px, 0px)',
        })
      ),
      state(
        'leaveToLeft',
        style({
          opacity: 0,
          transform: 'translate(-100px, 0px)',
        })
      ),
      state(
        'leaveToRight',
        style({
          opacity: 0,
          transform: 'translate(100px, 0px)',
        })
      ),
      transition('* => enterFromRight', [
        style({
          opacity: 0,
          transform: 'translate(30px, 0px)',
        }),
        animate('250ms 500ms ease-in'),
      ]),
      transition('* => enterFromLeft', [
        style({
          opacity: 0,
          transform: 'translate(-30px, 0px)',
        }),
        animate('250ms 500ms ease-in'),
      ]),
      transition('* => leaveToLeft', [
        style({
          opacity: 1,
        }),
        animate('250ms ease-out'),
      ]),
      transition('* => leaveToRight', [
        style({
          opacity: 1,
        }),
        animate('250ms ease-out'),
      ]),
    ]),
    trigger('showViewerTransition', [
      state(
        'true',
        style({
          opacity: 1,
        })
      ),
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', [
        style({
          opacity: 0,
        }),
        animate('1000ms ease-in'),
      ]),
      transition('* => void', [
        style({
          opacity: 1,
        }),
        animate('500ms ease-out'),
      ]),
    ]),
  ],
})
export class ViewerComponent {
  showViewer: boolean;
  images: GalleryImage[] = [];
  currentIdx = 0;
  leftArrowVisible = true;
  rightArrowVisible = true;
  categorySelected = 'previewSmall';
  transform: number;
  math: Math;
  private qualitySelectorShown = false;
  private qualitySelected = 'auto';

  constructor(private imageService: ImageService, private mediaService: MediaService) {
    imageService.imagesUpdated$.subscribe(images => {
      this.images = images;
    });
    imageService.imageSelectedIndexUpdated$.subscribe(newIndex => {
      this.currentIdx = newIndex;
      this.images.forEach(image => (image.active = false));
      this.images[this.currentIdx].active = true;
      this.transform = 0;
      this.updateQuality();
    });
    imageService.showImageViewerChanged$.subscribe(showViewer => {
      this.showViewer = showViewer;
    });
    this.math = Math;
  }

  get leftArrowActive(): boolean {
    return this.currentIdx > 0;
  }

  get rightArrowActive(): boolean {
    return this.currentIdx < this.images.length - 1;
  }

  pan(swipe: any): void {
    this.transform = swipe.deltaX;
  }

  onResize(): void {
    this.images.forEach(image => {
      image.viewerImageLoaded = false;
      image.active = false;
    });
    this.updateImage();
  }

  showQualitySelector(): void {
    this.qualitySelectorShown = !this.qualitySelectorShown;
  }

  qualityChanged(newQuality: any): void {
    this.qualitySelected = newQuality;
    this.updateImage();
  }

  imageLoaded(image: any): void {
    image.viewerImageLoaded = true;
  }

  /**
   * direction (-1: left, 1: right)
   * swipe (user swiped)
   */
  navigate(direction: number, swipe: any): void {
    if (
      (direction === 1 && this.currentIdx < this.images.length - 1) ||
      (direction === -1 && this.currentIdx > 0)
    ) {
      if (direction === -1) {
        this.images[this.currentIdx].transition = 'leaveToRight';
        this.images[this.currentIdx - 1].transition = 'enterFromLeft';
      } else {
        this.images[this.currentIdx].transition = 'leaveToLeft';
        this.images[this.currentIdx + 1].transition = 'enterFromRight';
      }
      this.currentIdx += direction;

      if (swipe) {
        this.hideNavigationArrows();
      } else {
        this.showNavigationArrows();
      }
      this.updateImage();
    }
  }

  showNavigationArrows(): void {
    this.leftArrowVisible = true;
    this.rightArrowVisible = true;
  }

  closeViewer(): void {
    this.images.forEach(image => (image.transition = undefined));
    this.images.forEach(image => (image.active = false));
    this.imageService.showImageViewer(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const prevent = ['ArrowLeft', 'ArrowRight', 'Escape', 'Home', 'End'].find(
      no => no === event.key
    );
    if (prevent) {
      event.preventDefault();
    }

    switch (prevent) {
      case 'ArrowLeft':
        // navigate left
        this.navigate(-1, false);
        break;
      case 'ArrowRight':
        // navigate right
        this.navigate(1, false);
        break;
      case 'Escape':
        // esc
        this.closeViewer();
        break;
      case 'Home':
        // pos 1
        this.images[this.currentIdx].transition = 'leaveToRight';
        this.currentIdx = 0;
        this.images[this.currentIdx].transition = 'enterFromLeft';
        this.updateImage();
        break;
      case 'End':
        // end
        this.images[this.currentIdx].transition = 'leaveToLeft';
        this.currentIdx = this.images.length - 1;
        this.images[this.currentIdx].transition = 'enterFromRight';
        this.updateImage();
        break;
      default:
        break;
    }
  }

  private hideNavigationArrows(): void {
    this.leftArrowVisible = false;
    this.rightArrowVisible = false;
  }

  private updateImage(): void {
    // wait for animation to end
    setTimeout(() => {
      this.updateQuality();
      this.images[this.currentIdx].active = true;
      this.images.forEach(image => {
        if (image !== this.images[this.currentIdx]) {
          image.active = false;
          this.transform = 0;
        }
      });
    }, 500);
  }

  getImagePath(image: GalleryImage, quality: string) {
    return environment.storageUrl + '/images/' + image[quality + 'Path'];
  }

  private updateQuality(): void {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    switch (this.qualitySelected) {
      case 'auto': {
        this.categorySelected = 'previewSmall';
        if (
          screenWidth > this.images[this.currentIdx].previewSmallWidth ||
          screenHeight > this.images[this.currentIdx].previewSmallHeight
        ) {
          this.categorySelected = 'previewMedium';
        }
        if (
          screenWidth > this.images[this.currentIdx].previewMediumWidth ||
          screenHeight > this.images[this.currentIdx].previewMediumHeight
        ) {
          this.categorySelected = 'previewLarge';
        }
        if (
          screenWidth > this.images[this.currentIdx].previewLargeWidth ||
          screenHeight > this.images[this.currentIdx].previewLargeHeight
        ) {
          this.categorySelected = 'raw';
        }
        break;
      }
      case 'low': {
        this.categorySelected = 'previewSmall';
        break;
      }
      case 'mid': {
        this.categorySelected = 'previewMedium';
        break;
      }
      case 'high': {
        this.categorySelected = 'previewLarge';
        break;
      }
      default: {
        this.categorySelected = 'raw';
      }
    }
  }
}
