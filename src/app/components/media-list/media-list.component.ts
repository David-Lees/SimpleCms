import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GalleryImage } from 'src/app/models/gallery-image';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.scss'],
})
export class MediaListComponent {
  @Input() images: GalleryImage[];
  @Input() canSelect: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() canMove: boolean = false;
  @Input() canSort: boolean = false;
  @Output() delete = new EventEmitter<GalleryImage>();
  @Output() selected = new EventEmitter<GalleryImage>();
  @Output() moved = new EventEmitter<GalleryImage>();
  
  prefix = environment.storageUrl + '/images/';

  select(image: GalleryImage) {
    this.selected.next(image);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (this.canSort) {
      console.log(event);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  remove(image: GalleryImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      this.delete.next(image);
    }
  }

  move(image:GalleryImage) {
    this.moved.next(image);
  }
}
