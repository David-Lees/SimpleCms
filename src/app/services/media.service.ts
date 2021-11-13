import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { BlobUploadService } from './blob-upload.service';
import { DateTime } from 'luxon';
import { ToastState } from '../enums/toast-state.enum';
import { GalleryFolder } from '../models/gallery-folder';
import { v4 as uuidv4 } from 'uuid';
import { GalleryImage } from '../models/gallery-image';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private http: HttpClient,
    private blobService: BlobUploadService,
    private toast: ToastService
  ) {}

  load(f: GalleryFolder) {
    return new Observable(obs => {
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
      this.http
        .get<GalleryImage[]>(`${environment.apiUrl}/api/folder/${f.rowKey}`, {
          headers,
        })
        .subscribe((x: GalleryImage[]) => {
          obs.next(x);
          obs.complete();
        });
    });
  }

  delete(i: GalleryImage) {
    if (confirm('Delete this image?')) {
      this.http
        .delete(`${environment.apiUrl}/api/folder/${i.partitionKey}/${i.rowKey}`)
        .subscribe(() => {
          this.toast.post({ body: 'Image deleted', state: ToastState.Success });
        });
    }
  }

  move(i: GalleryImage, f: GalleryFolder) {
    this.http
      .delete(
        `${environment.apiUrl}/api/MoveImage?oldParent=${i.partitionKey}&newParent=${f.rowKey}&id=${i.rowKey}`
      )
      .subscribe(() => {
        this.toast.post({ body: 'Image deleted', state: ToastState.Success });
      });
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
                      .post(
                        `${environment.apiUrl}/api/ProcessMedia?filename=${fileToUpload.name}&description=${fileToUpload.name}`,
                        ''
                      )
                      .subscribe(
                        () => {
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
