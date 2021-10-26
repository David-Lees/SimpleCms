import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { GallerySection } from 'src/app/models/gallery-section';
import { GalleryImage } from 'src/app/models/gallery-image';
import { environment } from 'src/environments/environment';
import { MediaService } from 'src/app/services/media.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Folder, GalleryFolder } from 'src/app/models/gallery-folder';

@Component({
  selector: 'app-edit-gallery',
  templateUrl: './edit-gallery.component.html',
  styleUrls: ['./edit-gallery.component.scss'],
})
export class EditGalleryComponent implements OnInit {
  @Input() section: GallerySection;
  @Output() sectionChange = new EventEmitter<GallerySection>();

  root: GalleryFolder;
  currentFolder: Folder;
  allFolders: Folder[] = [];
  availableImages: GalleryImage[];
  prefix = environment.storageUrl + '/images/';

  constructor(private media: MediaService) {}

  ngOnInit() {
    this.media.root.subscribe(x => {
      this.root = x;
      this.traverse(this.root, 0);
      this.availableImages = [...this.root.images];
    });
  }

  traverse(folder: GalleryFolder, level: number) {
    this.allFolders.push(new Folder(this.getFolderName(folder, level), folder));
    folder.folders.forEach(element => {
      this.traverse(element, level + 1);
    });
  }

  folderChange() {
    this.availableImages = this.currentFolder.folder.images;
  }

  getFolderName(folder: GalleryFolder, level: number) {
    let name = '';
    for (let i = 0; i < level; i++) {
      name += '--';
    }
    if (level > 0) name += '>';
    name += folder.name;
    return name;
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.availableImages = [...this.root.images];
    }
  }

  change() {
    this.sectionChange.emit(this.section);
  }

  add(img: GalleryImage) {
    this.section.images.push(img);
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
