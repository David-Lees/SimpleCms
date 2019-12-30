import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Site } from '../models/site';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private SITE: Site;
  private loaded = false;

  constructor(private http: HttpClient) {
    http.get<Site>('assests/site.json').subscribe((x: Site) => {
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
}
