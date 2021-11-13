import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GallerySection } from 'src/app/models/gallery-section';
import { GalleryImage } from 'src/app/models/gallery-image';
import { environment } from 'src/environments/environment';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FolderService } from 'src/app/services/folder.service';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { MatDialog } from '@angular/material/dialog';
import { FolderSelectComponent } from '../folder-select/folder-select.component';

@Component({
  selector: 'app-edit-gallery',
  templateUrl: './edit-gallery.component.html',
  styleUrls: ['./edit-gallery.component.scss'],
})
export class EditGalleryComponent implements OnInit {
  @Input() section: GallerySection;
  @Output() sectionChange = new EventEmitter<GallerySection>();

  currentFolder: GalleryFolder;
  allFolders: GalleryFolder[] = [];
  availableImages: GalleryImage[];
  prefix = environment.storageUrl + '/images/';

  constructor(public dialog: MatDialog, private folderService: FolderService) {}

  ngOnInit() {
    this.folderService.getFolders().subscribe(x => {
      this.allFolders = x;
      this.currentFolder = this.allFolders[0];
      this.folderService
        .getImages(this.currentFolder)
        .subscribe(y => (this.availableImages = [...y]));
    });
  }

  folderChange(folder: GalleryFolder) {
    console.log(folder);
    this.currentFolder = folder;
    this.folderService
      .getImages(this.currentFolder)
      .subscribe(y => (this.availableImages = [...y]));
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.folderService
        .getImages(this.currentFolder)
        .subscribe(y => (this.availableImages = [...y]));
    }
  }

  change() {
    this.sectionChange.emit(this.section);
  }

  add(img: GalleryImage) {
    this.section.images.push(JSON.parse(JSON.stringify(img)));
    this.change();
  }

  remove(x: number) {
    this.section.images.splice(x, 1);
    this.change();
  }

  up(x: number) {
    if (x > 0) {
      this.move(x, x - 1);
      this.change();
    }
  }

  down(x: number) {
    if (x < this.section.images.length) {
      this.move(x, x + 1);
      this.change();
    }
  }

  move(from: number, to: number) {
    const removedElement = this.section.images.splice(from, 1)[0];
    this.section.images.splice(to, 0, removedElement);
  }
}
