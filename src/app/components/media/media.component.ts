import { Component, OnInit, OnDestroy } from '@angular/core';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { MediaService } from 'src/app/services/media.service';
import { Subscription } from 'rxjs';
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
    private mediaService: MediaService
  ) {}
  root: GalleryFolder;
  currentFolder: GalleryFolder;
  subscription: Subscription;
  folderName = 'New Folder';

  select(folder: GalleryFolder) {
    this.currentFolder = folder;
  }

  save() {
    console.log('saving site', this.root);
    this.mediaService.save(this.root);
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
        console.log('move result', result);
        const idx = this.currentFolder.images.indexOf(image);
        if (idx >= 0) {
          const i = this.currentFolder.images.splice(idx, 1);
          result.images.push(i[0]);
        }
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
    }
  }

  addFolder() {
    this.currentFolder.folders.push({
      name: this.folderName,
      id: uuidv4(),
      folders: [],
      images: [],
    });
    this.save();
  }

  renameFolder() {
    if (this.currentFolder && this.folderName && this.folderName.length) {
      this.currentFolder.name = this.folderName;
      this.save();
    }
  }

  deleteFolder() {
    if (
      this.currentFolder &&
      this.currentFolder !== this.root &&
      this.currentFolder.folders.length === 0 &&
      this.currentFolder.images.length === 0 &&
      confirm('Are you sure you want to delete the "' + this.currentFolder.name + '" folder?')
    ) {
      const parent = this.getParentNode(this.currentFolder.id);
      console.log('parent', parent);
      if (parent) {
        let i = parent.folders.findIndex(c => c.id === this.currentFolder.id);
        parent.folders.splice(i, 1);
      }
      this.currentFolder = this.root;
      this.save();
    }
  }

  getParentNode(id: string, nodesToSearch?: GalleryFolder): GalleryFolder {
    if (!nodesToSearch) {
      nodesToSearch = this.root;
    }
    for (let node of nodesToSearch.folders || []) {
      if (node.id == id) return nodesToSearch;
      let ret = this.getParentNode(id, node);
      if (ret) return ret;
    }
    return null;
  }

  onFileComplete() {
    this.mediaService.load();
  }
}
