import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-admin-sort-sections',
  templateUrl: './admin-sort-sections.component.html',
  styleUrls: ['./admin-sort-sections.component.scss'],
})
export class AdminSortSectionsComponent {
  times = faTimes;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AdminSortSectionsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public page: Page
  ) {}

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.page.sections, event.previousIndex, event.currentIndex);
  }

  dismiss() {
    this._bottomSheetRef.dismiss();
  }
}
