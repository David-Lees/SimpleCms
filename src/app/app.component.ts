import { Component, OnInit } from '@angular/core';
import { SiteService } from './services/site.service';
import { Site } from './models/site';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  loaded = false;
  site: Site;

  constructor(private siteService: SiteService, public adalService: MsAdalAngular6Service) {}

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      this.loaded = true;
    } else {
      setTimeout(() => this.load(), 10);
    }
  }
}
