import { Component, OnInit, OnDestroy } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { MediaService } from 'src/app/services/media.service';
import { Subscription } from 'rxjs';
import { ITreeOptions, ITreeState } from '@circlon/angular-tree-component';
import { v4 as uuidv4 } from 'uuid';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { GalleryImage } from 'src/app/models/gallery-image';
import { MatDialog } from '@angular/material/dialog';
import { FolderSelectComponent } from '../folder-select/folder-select.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
})
export class MediaComponent implements OnInit, OnDestroy {
  constructor(
    public dialog: MatDialog,
    public adalService: MsAdalAngular6Service,
    private mediaService: MediaService,
  ) {}
  root: GalleryFolder;
  currentFolder: GalleryFolder;
  subscription: Subscription;
  folderName = 'New Folder';

  state: ITreeState = {
    expandedNodeIds: {},
    hiddenNodeIds: {},
    activeNodeIds: {},
  };

  options: ITreeOptions = {
    allowDrag: node => {
      return true;
    },
    allowDrop: node => {
      return true;
    },
    useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    allowDragoverStyling: true,
    hasChildrenField: 'folders',
    getNodeClone: node => ({
      ...node.data,
      id: uuidv4(),
      name: `copy of ${node.data.name}`,
    }),
  };

  select(folder: GalleryFolder) {
    this.currentFolder = folder;
  }

  save() {
    console.log('saving site', this.root);
    this.mediaService.save(this.root);
    this.mediaService.load();
  }

  ngOnInit() {
    this.subscription = this.mediaService.root.subscribe(x => {
      this.root = x;
      this.currentFolder = x;
    });
    this.mediaService.load();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  move(image: GalleryImage) {
    const dialogRef = this.dialog.open(FolderSelectComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result: GalleryFolder) => {
      console.log('The dialog was closed');
      if (result) {
        const idx = this.currentFolder.images.indexOf(image);
        if (idx >= 0) {
          this.currentFolder.images.splice(idx, 1);
        }
        result.images.push(image);
        this.save();
      }
    });
  }

  delete(image: GalleryImage) {
    if (confirm('Are you sure you want to delete this image?')) {
      const idx = this.currentFolder.images.indexOf(image);
      if (idx >= 0) {
        this.currentFolder.images.splice(idx, 1);
      }
      this.mediaService.delete(image.id);
      this.mediaService.load();
    }
  }

  addFolder() {
    this.currentFolder.folders.push({
      name: this.folderName,
      id: uuidv4(),
      folders: [],
      images: []
    });
    this.save();
  }

  onFileComplete() {
    this.mediaService.load();
  }
}
