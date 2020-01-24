import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GalleryImage } from '../models/gallery-image';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { BlobUploadService } from './blob-upload.service';
import * as moment from 'moment';
import { ToastState } from '../enums/toast-state.enum';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  images = new ReplaySubject<GalleryImage[]>(1);

  constructor(private http: HttpClient, private blobService: BlobUploadService, private toast: ToastService) {}

  map(x: any[]): GalleryImage[] {
    return x.map(z => {
      return {
        preview_xxs: z.files.preview_xxs,
        preview_xs: z.files.preview_xs,
        preview_s: z.files.preview_s,
        preview_m: z.files.preview_m,
        preview_l: z.files.preview_l,
        preview_xl: z.files.preview_xl,
        raw: z.files.raw,
        dominantColour: z.dominantColour,
        id: z.id,
        description: z.description,
      };
    });
  }

  load() {
    this.http.get(environment.storageUrl + '/images/images.json').subscribe((x: any[]) => {
      const y = this.map(x);
      this.images.next(y);
    });
  }

  update(i: GalleryImage[]) {
    this.images.next(i);
  }

  delete(id: string) {
    if (confirm('Delete this image?')) {
      this.http.delete<any>(environment.apiUrl + '/api/DeleteMedia/' + id).subscribe((x: any) => {
        this.update(this.map(x.images));
        this.toast.post({ body: 'Image deleted', state: ToastState.Success });
      });
    }
  }

  upload(filesToUpload: FileList): void {
    if (filesToUpload) {
      this.blobService.getUserDelegationKey().subscribe(key => {
        for (let i = 0; i < filesToUpload.length; i++) {
          const headers = {
            //Authorization: 'bearer ' + this.adalService.accessToken,
            'x-ms-date': moment().toISOString(),
            'x-ms-version': '2017-11-09',
            'Content-Type': filesToUpload[i].type,
            'x-ms-blob-type': 'BlockBlob',
          };

          const blockid = btoa(
            Math.random()
              .toString(36)
              .substring(7)
          );

          let token: string = key.token;
          token = token.substring(1);
          const url = environment.storageUrl + '/image-upload/' + filesToUpload[i].name + '?comp=block&blockid=' + blockid + '&' + token;

          var reader = new FileReader();
          // define what happens on reading the reader
          reader.onload = () => {
            this.http.put(url, reader.result, { headers: headers }).subscribe(
              x => {
                const body = `<?xml version="1.0" encoding="utf-8"?>\r\n<BlockList>\r\n<Latest>${blockid}</Latest>\r\n</BlockList>`;
                this.http.put(url.replace('comp=block&', 'comp=blocklist&'), body).subscribe(
                  y => {
                    this.http
                      .post<GalleryImage[]>(environment.apiUrl + '/api/ProcessMedia?filename=' + filesToUpload[i].name, '')
                      .subscribe(
                        z => {
                          this.update(this.map(z));
                          this.toast.post({ body: 'Image uploaded', state: ToastState.Success });
                        },
                        () => {
                          this.toast.post({ body: 'Unbale to process uploaded file. May not be an image.', state: ToastState.Error });
                        }
                      );
                  },
                  () => {
                    this.toast.post({ body: 'Unbale to upload file.', state: ToastState.Error });
                  }
                );
              },
              () => {
                this.toast.post({ body: 'Unbale to upload file.', state: ToastState.Error });
              }
            );
          };
          // trigger above by reading the reader
          reader.readAsArrayBuffer(filesToUpload[i]);
        }
      });
    }
  }
}
