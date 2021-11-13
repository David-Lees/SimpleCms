import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GalleryFolder } from '../models/gallery-folder';
import { GalleryImage } from '../models/gallery-image';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  empty = '00000000-0000-0000-0000-000000000000';
  private isLoaded = false;
  private folders: GalleryFolder[];

  constructor(private http: HttpClient) {}

  getFolders(): Observable<GalleryFolder[]> {
    return new Observable(obs => {
      if (this.isLoaded) {
        console.log('existing folders', this.folders);
        obs.next(this.folders);
        obs.complete();
      } else {
        this.http
          .get<GalleryFolder[]>(`${environment.apiUrl}/api/folder`)
          .subscribe((x: GalleryFolder[]) => {
            x.sort((a, b) => a.name.localeCompare(b.name));
            console.log('get folders', x);
            this.isLoaded = true;
            this.folders = x;
            obs.next(this.folders);
            obs.complete();
            console.log('set folders', this.folders);
          });
      }
    });
  }

  private reload() {
    this.http
      .get<GalleryFolder[]>(`${environment.apiUrl}/api/folder`)
      .subscribe((x: GalleryFolder[]) => {
        x.sort((a, b) => a.name.localeCompare(b.name));
        this.folders = x;
        console.log('reload folders', this.folders);
        this.isLoaded = true;
      });
  }

  update(f: GalleryFolder[]) {
    this.folders = f;
  }

  delete(f: GalleryFolder) {
    this.http.delete(`${environment.apiUrl}/api/folder`, { body: f }).subscribe(() => {
      this.reload();
    });
  }

  move(folder: GalleryFolder, destination: string) {
    this.http.put(`${environment.apiUrl}/api/folder/${destination}`, folder).subscribe(() => {
      this.reload();
    });
  }

  create(folder: GalleryFolder) {
    this.http.post(`${environment.apiUrl}/api/folder`, folder).subscribe(() => {
      this.reload();
    });
  }

  getImages(f: GalleryFolder): Observable<GalleryImage[]> {
    return new Observable(obs => {
      this.http.get<GalleryImage[]>(`${environment.apiUrl}/api/folder/${f.rowKey}`).subscribe(x => {
        obs.next(x);
        obs.complete();
      });
    });
  }
}
