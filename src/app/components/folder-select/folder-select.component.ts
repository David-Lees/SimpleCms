import { Component, OnInit } from '@angular/core';
import { Folder, GalleryFolder } from 'src/app/models/gallery-folder';
import { MediaService } from 'src/app/services/media.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.scss'],
})
export class FolderSelectComponent implements OnInit {
  allFolders: Folder[] = [];
  currentFolder: GalleryFolder;

  constructor(
    public dialogRef: MatDialogRef<FolderSelectComponent>,
    private media: MediaService,
  ) {}

  ngOnInit() {
    this.media.root.subscribe(x => {
      this.traverse(x, 0);
      this.currentFolder = x;
    });
  }

  traverse(folder: GalleryFolder, level: number) {
    this.allFolders.push(new Folder(this.getFolderName(folder, level), folder));
    folder.folders.forEach(element => {
      this.traverse(element, level + 1);
    });
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
}

