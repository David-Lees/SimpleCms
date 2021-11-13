import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BannerSection } from 'src/app/models/banner-section';
import { MediaService } from 'src/app/services/media.service';
import { GalleryImage } from 'src/app/models/gallery-image';
import { environment } from 'src/environments/environment';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { MatDialog } from '@angular/material/dialog';
import { SelectImageComponent } from '../select-image/select-image.component';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.scss'],
})
export class EditBannerComponent implements OnInit {
  @Input() section: BannerSection;
  @Output() sectionChange = new EventEmitter<BannerSection>();

  folder: GalleryFolder;
  prefix = environment.storageUrl + '/images/';

  constructor(public dialog: MatDialog, private media: MediaService) {}

  ngOnInit() {
    // this.media.root.subscribe(x => {
    //   this.folder = x;
    // });
  }

  change() {
    this.sectionChange.emit(this.section);
  }

  select() {
    const dialogRef = this.dialog.open(SelectImageComponent, {
      width: '90%',
    });

    dialogRef.afterClosed().subscribe((result: GalleryImage) => {
      if (result) {
        this.set(result);
      }
    });
  }

  set(img: GalleryImage) {
    this.section.image = JSON.parse(JSON.stringify(img));
    this.change();
  }
}
