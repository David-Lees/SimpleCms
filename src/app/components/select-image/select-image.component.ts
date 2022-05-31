import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { GalleryImage } from 'src/app/models/gallery-image';
import { FolderService } from 'src/app/services/folder.service';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit, OnDestroy {
  @Input() selection: GalleryImage;
  @Output() selectionChange = new EventEmitter<GalleryImage>();
  folders: GalleryFolder[];
  currentFolder: GalleryFolder;
  subscription: Subscription;
  images: GalleryImage[] = [];

  selectFolder(folder: GalleryFolder) {
    this.currentFolder = folder;
    this.folderService.getImages(this.currentFolder).subscribe(x => {
      this.images = x;
    });
  }

  selectImage(image: GalleryImage) {
    this.dialogRef.close(image);
  }

  constructor(
    public dialogRef: MatDialogRef<SelectImageComponent>,
    public dialog: MatDialog,
    protected media: MediaService,
    public folderService: FolderService
  ) {}

  ngOnInit() {
    this.subscription = this.folderService.getFolders().subscribe(x => {
      this.folders = x;
      this.selectFolder(this.folders.find(y => y.rowKey === this.folderService.empty));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
