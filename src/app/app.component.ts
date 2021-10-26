import { Component, OnInit } from '@angular/core';
import { SiteService } from './services/site.service';
import { Site } from './models/site';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { Page } from './models/page';
import { v4 as uuidv4 } from 'uuid';

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

  getYear() {
    return new Date().getFullYear();
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      this.site.pages.forEach(element => {
        this.walkPages(element);
      });
      this.loaded = true;
    } else {
      setTimeout(() => this.load(), 10);
    }
  }

  walkPages(page: Page) {
    if (!page.id) {
      page.id = uuidv4();
    }
    if (!page.pages) {
      page.pages = [];
    }
    page.pages.forEach(element => {
      this.walkPages(element);
    });
  }
}
