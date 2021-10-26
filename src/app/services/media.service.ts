import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { BlobUploadService } from './blob-upload.service';
import { DateTime } from 'luxon';
import { ToastState } from '../enums/toast-state.enum';
import { GalleryFolder } from '../models/gallery-folder';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  root = new ReplaySubject<GalleryFolder>(1);

  constructor(
    private http: HttpClient,
    private blobService: BlobUploadService,
    private toast: ToastService
  ) {}

  load() {
    this.http
      .get<GalleryFolder>(environment.storageUrl + '/images/images.json')
      .subscribe((x: GalleryFolder) => {
        this.update(x);
      });
  }

  save(data: GalleryFolder) {
    this.http.post<GalleryFolder>(environment.apiUrl + '/api/UpdateMedia', data).subscribe(
      x => {
        this.update(x);
        this.toast.post({ body: 'Media Saved', state: ToastState.Success });
      },
      error => {
        console.log(error);
        this.toast.post({ body: 'Unable to save site', state: ToastState.Error });
      }
    );
  }

  update(f: GalleryFolder) {
    this.root.next(f);
  }

  delete(id: string) {
    if (confirm('Delete this image?')) {
      this.http
        .delete<GalleryFolder>(environment.apiUrl + '/api/DeleteMedia/' + id)
        .subscribe(x => {
          this.update(x);
          this.toast.post({ body: 'Image deleted', state: ToastState.Success });
        });
    }
  }

  upload(filesToUpload: FileList): void {
    if (filesToUpload) {
      this.blobService.getUserDelegationKey().subscribe(key => {
        Array.from(filesToUpload).forEach(fileToUpload => {
          const headers = {
            // Authorization: 'bearer ' + this.adalService.accessToken,
            'x-ms-date': DateTime.now().toISO(),
            'x-ms-version': '2017-11-09',
            'Content-Type': fileToUpload.type,
            'x-ms-blob-type': 'BlockBlob',
          };

          const blockid = btoa(uuidv4());

          let token: string = key.token;
          token = token.substring(1);
          const url = `${environment.storageUrl}/image-upload/${fileToUpload.name}?comp=block&blockid=${blockid}&${token}`;

          const reader = new FileReader();
          // define what happens on reading the reader
          reader.onload = () => {
            this.http.put(url, reader.result, { headers }).subscribe(
              x => {
                const body = `<?xml version="1.0" encoding="utf-8"?>\r\n<BlockList>\r\n<Latest>${blockid}</Latest>\r\n</BlockList>`;
                this.http.put(url.replace('comp=block&', 'comp=blocklist&'), body).subscribe(
                  y => {
                    this.http
                      .post<GalleryFolder>(
                        `${environment.apiUrl}/api/ProcessMedia?filename=${fileToUpload.name}&description=${fileToUpload.name}`,
                        ''
                      )
                      .subscribe(
                        z => {
                          this.update(z);
                          this.toast.post({ body: 'Image uploaded', state: ToastState.Success });
                        },
                        () => {
                          this.toast.post({
                            body: 'Unable to process uploaded file. May not be an image.',
                            state: ToastState.Error,
                          });
                        }
                      );
                  },
                  () => {
                    this.toast.post({ body: 'Unable to upload file.', state: ToastState.Error });
                  }
                );
              },
              () => {
                this.toast.post({ body: 'Unable to upload file.', state: ToastState.Error });
              }
            );
          };
          // trigger above by reading the reader
          reader.readAsArrayBuffer(fileToUpload);
        });
      });
    }
  }
}
