import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { FolderService } from 'src/app/services/folder.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-add-folder',
  templateUrl: './admin-add-folder.component.html',
})
export class AdminAddFolderComponent {
  times = faTimes;
  folderName = 'New Folder';

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdminAddFolderComponent>,
    private folderService: FolderService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public folder: GalleryFolder
  ) {}

  dismiss() {
    this._bottomSheetRef.dismiss();
  }

  addFolder() {
    const newFolder: GalleryFolder = {
      partitionKey: this.folder.rowKey,
      rowKey: uuidv4(),
      name: this.folderName,
    };
    this.folderService.create(newFolder);
    this.folderService.getFolders().subscribe(f => {
      f.push(newFolder);
      this.folderService.update(f);
    });
    this.dismiss();
  }
}
