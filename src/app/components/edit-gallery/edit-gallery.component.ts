import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GallerySection } from 'src/app/models/gallery-section';
import { GalleryImage } from 'src/app/models/gallery-image';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-gallery',
  templateUrl: './edit-gallery.component.html',
  styleUrls: ['./edit-gallery.component.scss'],
})
export class EditGalleryComponent implements OnInit {
  @Input() section: GallerySection;
  @Output() sectionChange = new EventEmitter<GallerySection>();

  images: GalleryImage[];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<GalleryImage[]>('images.json').subscribe(x => {
      this.images = x;
    });
  }

  change() {
    this.sectionChange.emit({ ...this.section });
  }

  add(img: GalleryImage) {
    this.section.images.push(img);
    this.change();
  }

  remove(x: number) {
    this.section.images = this.section.images.splice(x);
    this.change();
  }

  up(x: number) {
    if (x > 0) {
      this.move(x, x - 1);
      this.change();
    }
  }

  down(x: number) {
    if (x < this.section.images.length) {
      this.move(x, x + 1);
      this.change();
    }
  }

  move(from: number, to: number) {
    this.section.images = [...this.section.images.splice(to, 0, this.section.images.splice(from, 1)[0])];
  }
}
