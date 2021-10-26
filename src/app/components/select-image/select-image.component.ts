import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ITreeState, ITreeOptions } from '@circlon/angular-tree-component';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { GalleryImage } from 'src/app/models/gallery-image';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.scss'],
})
export class SelectImageComponent implements OnInit {
  @Input() selection: GalleryImage;
  @Output() selectionChange = new EventEmitter<GalleryImage>();
  root: GalleryFolder;
  currentFolder: GalleryFolder;
  currentImage: GalleryImage;

  selectFolder(folder: GalleryFolder) {
    this.currentFolder = folder;
  }

  selectImage(image: GalleryImage) {
    this.currentImage = image;
    this.dialogRef.close(this.currentImage);
  }

  constructor(
    public dialogRef: MatDialogRef<SelectImageComponent>,
    public dialog: MatDialog,
    protected media: MediaService
  ) {}

  ngOnInit(): void {
    this.media.root.subscribe(x => {
      this.root = x;
      this.currentFolder = this.root;
    });
  }
}
