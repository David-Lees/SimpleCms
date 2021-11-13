import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  faEllipsisH,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faList,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Subscription } from 'rxjs';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { GalleryImage } from 'src/app/models/gallery-image';
import { FolderService } from 'src/app/services/folder.service';
import { MediaService } from 'src/app/services/media.service';
import { FolderSelectComponent } from '../folder-select/folder-select.component';
import { v4 as uuidv4 } from 'uuid';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MaterialFileUploadComponent } from '../material-file-upload/material-file-upload.component';
import { AdminAddFolderComponent } from '../admin-add-folder/admin-add-folder.component';
import { AdminRenameFolderComponent } from '../admin-rename-folder/admin-rename-folder.component';

@Component({
  selector: 'app-admin-library',
  templateUrl: './admin-library.component.html',
  styleUrls: ['./admin-library.component.scss'],
})
export class AdminLibraryComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  folders: GalleryFolder[] = [];
  list = faList;
  ellipse = faEllipsisH;
  uploadIcon = faUpload;
  showFolders = true;
  currentFolder: GalleryFolder;
  images: GalleryImage[] = [];
  folderName = 'New Folder';

  constructor(
    public dialog: MatDialog,
    public adalService: MsAdalAngular6Service,
    private mediaService: MediaService,
    public folderService: FolderService,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.subscription = this.folderService.getFolders().subscribe(x => {
      this.folders = [...x];
      this.folderChange(this.folders.find(y => y.rowKey === this.folderService.empty));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  upload() {
    const ref = this._bottomSheet.open(MaterialFileUploadComponent, { data: this.currentFolder });
    ref.afterDismissed().subscribe(dataFromChild => {
      if (dataFromChild) this.folderChange(this.currentFolder);
    });
  }

  folderChange(folder: GalleryFolder) {
    this.currentFolder = folder;
    this.images = [];
    this.folderService.getImages(folder).subscribe(x => (this.images = x));
  }

  move(image: GalleryImage) {
    const dialogRef = this.dialog.open(FolderSelectComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((result: GalleryFolder) => {
      this.mediaService.move(image, result);
      this.folderChange(this.currentFolder);
    });
  }

  delete(image: GalleryImage) {
    if (confirm('Are you sure you want to delete this image?')) {
      this.mediaService.delete(image);
    }
  }

  addFolder() {
    this._bottomSheet.open(AdminAddFolderComponent, { data: this.currentFolder });
  }

  renameFolder() {
    this._bottomSheet.open(AdminRenameFolderComponent, { data: this.currentFolder });
  }

  deleteFolder() {
    if (
      this.currentFolder &&
      this.currentFolder.rowKey !== this.folderService.empty &&
      this.folders.filter(x => x.partitionKey === this.currentFolder.rowKey).length === 0 &&
      this.images.filter(x => x.partitionKey === this.currentFolder.rowKey).length === 0 &&
      confirm('Are you sure you want to delete the "' + this.currentFolder.name + '" folder?')
    ) {
      this.folderService.delete(this.currentFolder);
      this.currentFolder = this.folders.find(x => x.rowKey == this.folderService.empty);
    }
  }

  canDelete() {
    return (
      this.currentFolder &&
      this.folders.filter(x => x.partitionKey === this.currentFolder.rowKey).length === 0 &&
      this.currentFolder.rowKey !== this.folderService.empty &&
      this.images.length === 0
    );
  }

  canRename() {
    return this.currentFolder && this.currentFolder.rowKey !== this.folderService.empty;
  }
}
