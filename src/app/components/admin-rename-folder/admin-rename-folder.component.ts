import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { FolderService } from 'src/app/services/folder.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-rename-folder',
  templateUrl: './admin-rename-folder.component.html',
})
export class AdminRenameFolderComponent {
  times = faTimes;
  folderName = 'New Folder';

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdminRenameFolderComponent>,
    private folderService: FolderService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public folder: GalleryFolder
  ) {
    this.folderName = folder.name;
  }

  dismiss() {
    this._bottomSheetRef.dismiss();
  }

  renameFolder() {
    this.folder.name = this.folderName;
    this.folderService.create(this.folder);
    this.dismiss();
  }
}
