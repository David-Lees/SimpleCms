import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpResponse, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';
import { MediaService } from 'src/app/services/media.service';
import { BlobUploadService } from 'src/app/services/blob-upload.service';
import { ToastService } from 'src/app/services/toast.service';
import { ToastState } from 'src/app/enums/toast-state.enum';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { GalleryImage } from 'src/app/models/gallery-image';
import { of, Subscription } from 'rxjs';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: './material-file-upload.component.html',
  styleUrls: ['./material-file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [state('in', style({ opacity: 100 })), transition('* => void', [animate(300, style({ opacity: 0 }))])]),
  ],
})
export class MaterialFileUploadComponent implements OnInit {
  /** Link text */
  @Input() text = 'Upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = 'https://file.io';
  /** File extension that accepted, same as 'accept' of <input type="file" />. 
     By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() complete = new EventEmitter<string>();

  public files: Array<FileUploadModel> = [];

  constructor(
    private _http: HttpClient,
    private toast: ToastService,
    private mediaService: MediaService,
    private blobService: BlobUploadService
  ) {}

  ngOnInit() {}

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, state: 'in', inProgress: false, progress: 0, canRetry: false, canCancel: true });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    console.log('Attempting to get upload key');
    this.blobService.getUserDelegationKey().subscribe(
      key => {
        console.log('Upload key obtained');
        const headers = {
          'x-ms-date': moment().toISOString(),
          'x-ms-version': '2017-11-09',
          'Content-Type': file.data.type,
          'x-ms-blob-type': 'BlockBlob',
        };

        const blockid = btoa(
          Math.random()
            .toString(36)
            .substring(7)
        );

        let token: string = key.token;
        token = token.substring(1);
        const url = environment.storageUrl + '/image-upload/' + file.data.name + '?comp=block&blockid=' + blockid + '&' + token;

        console.log('Ready to upload to ' + url);

        var reader = new FileReader();
        reader.onload = () => {
          console.log('file has been read');
          const req = new HttpRequest('PUT', url, reader.result, {
            reportProgress: true,
          });
          file.inProgress = true;
          file.sub = this._http
            .request(req)
            .pipe(
              map(event => {
                console.log('pipe map', event);
                switch (event.type) {
                  case HttpEventType.UploadProgress:
                    file.progress = Math.round((event.loaded * 100) / event.total);
                    break;
                  case HttpEventType.Response:
                    return event;
                }
              }),
              tap(message => {}),
              last(),
              catchError((error: HttpErrorResponse) => {
                file.inProgress = false;
                file.canRetry = true;
                return of(`${file.data.name} upload failed.`);
              })
            )
            .subscribe((event: any) => {
              console.log('subscribe', event);
              if (typeof event === 'object') {
                this.removeFileFromArray(file);
                this.complete.emit(event.body);
                const body = `<?xml version="1.0" encoding="utf-8"?>\r\n<BlockList>\r\n<Latest>${blockid}</Latest>\r\n</BlockList>`;
                console.log('file uploaded, time to process it');
                this._http.put(url.replace('comp=block&', 'comp=blocklist&'), body).subscribe(
                  y => {
                    this._http
                      .post<GalleryImage[]>(environment.apiUrl + '/api/ProcessMedia?filename=' + file.data.name, '')
                      .subscribe(
                        z => {
                          this.mediaService.update(this.mediaService.map(z));
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
              }
            });
          console.log('sub', file.sub);
        };
        reader.readAsArrayBuffer(file.data);
      },
      () => this.toast.post({ body: 'Unable to obtain security token to start upload to storage', state: ToastState.Error })
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }
}

export class FileUploadModel {
  data: File;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
