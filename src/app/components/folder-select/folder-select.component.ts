import { Component, OnInit } from '@angular/core';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { MatDialogRef } from '@angular/material/dialog';
import { FolderService } from 'src/app/services/folder.service';
import {
  faCaretDown,
  faCaretRight,
  faFolder,
  faFolderOpen,
  faFolderPlus,
  faList,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.scss'],
})
export class FolderSelectComponent implements OnInit {
  allFolders: GalleryFolder[] = [];
  currentFolder: GalleryFolder;
  list = faList;
  folder = faFolder;
  folderOpen = faFolderOpen;
  folderPlus = faFolderPlus;
  caretRight = faCaretRight;
  caretDown = faCaretDown;

  constructor(
    public dialogRef: MatDialogRef<FolderSelectComponent>,
    private folderService: FolderService
  ) {}

  ngOnInit() {
    this.folderService.getFolders().subscribe(x => {
      this.allFolders = x;
      this.currentFolder = this.allFolders.find(y => y.rowKey === this.folderService.empty);
    });
  }

  getRoot() {
    return this.allFolders.find(
      x => x.partitionKey === this.folderService.empty && x.rowKey === this.folderService.empty
    );
  }

  hasChildren(parentId: string) {
    return this.getChildren(parentId).length > 0;
  }

  getChildren(parentId: string) {
    return this.allFolders.filter(
      x => x.partitionKey === parentId && x.rowKey !== this.folderService.empty
    );
  }
}
