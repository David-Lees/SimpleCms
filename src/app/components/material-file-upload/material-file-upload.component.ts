import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient, HttpRequest, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { catchError, last, map, tap } from 'rxjs/operators';
import { MediaService } from 'src/app/services/media.service';
import { BlobUploadService } from 'src/app/services/blob-upload.service';
import { ToastService } from 'src/app/services/toast.service';
import { ToastState } from 'src/app/enums/toast-state.enum';
import { environment } from 'src/environments/environment';
import { GalleryImage } from 'src/app/models/gallery-image';
import { forkJoin, Observable, of, Subscription } from 'rxjs';
import { GalleryFolder } from 'src/app/models/gallery-folder';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-material-file-upload',
  templateUrl: './material-file-upload.component.html',
  styleUrls: ['./material-file-upload.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class MaterialFileUploadComponent {
  /* Link text */
  @Input() text = 'Upload';
  /* Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /* Target URL for file uploading. */
  @Input() target = 'https://file.io';
  /* File extension that accepted, same as 'accept' of <input type="file" />.
   * By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';
  /* Allow you to add handler after its completion. Bubble up response text from remote. */
  @Output() uploadComplete = new EventEmitter<string>();

  public files: Array<FileUploadModel> = [];
  times = faTimes;

  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private mediaService: MediaService,
    private blobService: BlobUploadService,
    private _bottomSheetRef: MatBottomSheetRef<MaterialFileUploadComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public folder: GalleryFolder
  ) {}

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      Array.from(fileUpload.files).forEach(file =>
        this.files.push({
          data: file,
          state: 'in',
          inProgress: false,
          progress: 0,
          canRetry: false,
          canCancel: true,
        })
      );
      this.uploadFiles().subscribe(() => {
        this._bottomSheetRef.dismiss(true);
      });
    };
    fileUpload.click();
  }

  dismiss() {
    this._bottomSheetRef.dismiss(false);
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
    return new Observable(obs => {
      this.blobService.getUserDelegationKey().subscribe(
        key => {
          const blockid = btoa(Math.random().toString(36).substring(7));

          let token: string = key.token;
          token = token.substring(token.indexOf('?') + 1);
          const url =
            environment.storageUrl +
            '/image-upload/' +
            file.data.name +
            '?comp=block&blockid=' +
            blockid +
            '&' +
            token;

          const reader = new FileReader();
          reader.onload = () => {
            const req = new HttpRequest('PUT', url, reader.result, {
              reportProgress: true,
            });
            file.inProgress = true;
            file.sub = this.http
              .request(req)
              .pipe(
                map(event => {
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
                  obs.error();
                  return of(`${file.data.name} upload failed.`);
                })
              )
              .subscribe((event: any) => {
                if (typeof event === 'object') {
                  this.removeFileFromArray(file);
                  this.uploadComplete.emit(event.body);
                  const body = `<?xml version="1.0" encoding="utf-8"?>\r\n<BlockList>\r\n<Latest>${blockid}</Latest>\r\n</BlockList>`;
                  this.http.put(url.replace('comp=block&', 'comp=blocklist&'), body).subscribe(
                    y => {
                      this.http
                        .post(
                          `${environment.apiUrl}/api/ProcessUpload?filename=${file.data.name}&folder=${this.folder?.rowKey}&description=${file.data.name}`,
                          ''
                        )
                        .subscribe(
                          () => {
                            obs.next(true);
                            obs.complete();
                            this.toast.post({ body: 'Image uploaded', state: ToastState.Success });
                          },
                          () => {
                            this.toast.post({
                              body: 'Unable to process uploaded file. May not be an image.',
                              state: ToastState.Error,
                            });
                            obs.error();
                          }
                        );
                    },
                    () => {
                      this.toast.post({ body: 'Unable to upload file.', state: ToastState.Error });
                      obs.error();
                    }
                  );
                }
              });
          };
          reader.readAsArrayBuffer(file.data);
        },
        () => {
          this.toast.post({
            body: 'Unable to obtain security token to start upload to storage',
            state: ToastState.Error,
          });
          obs.error();
        }
      );
    });
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    const tasks = [];
    this.files.forEach(file => {
      tasks.push(this.uploadFile(file));
    });
    return forkJoin(tasks);
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
