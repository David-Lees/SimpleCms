import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Site } from '../models/site';
import { environment } from 'src/environments/environment';
import { ToastService } from './toast.service';
import { ToastState } from '../enums/toast-state.enum';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private SITE: Site;
  private loaded = false;

  constructor(private http: HttpClient, private toast: ToastService) {
    http.get<Site>(environment.storageUrl + '/images/site.json').subscribe((x: Site) => {
      this.SITE = x;
      this.loaded = true;
    });
  }

  get site(): Site {
    return this.SITE;
  }

  get isLoaded() {
    return this.loaded;
  }

  save(site: Site) {
    this.http.post<Site>(environment.apiUrl + '/api/UpdateSite', site).subscribe(
      (x: Site) => {
        this.SITE = x;
        this.toast.post({ body: 'Site Saved', state: ToastState.Success });
      },
      error => {
        console.log(error);
        this.toast.post({ body: 'Unable to save site', state: ToastState.Error });
      }
    );
  }
}
