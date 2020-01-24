import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { Site } from 'src/app/models/site';
import { Page } from 'src/app/models/page';
import { MediaService } from 'src/app/services/media.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent implements OnInit {
  site: Site;
  loaded = false;
  activePage = 0;
  constructor(private siteService: SiteService, private mediaService: MediaService) {}

  save() {
    console.log('saving site', this.site);
    this.siteService.save(this.site);
  }

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
      this.loaded = true;
    } else {
      setTimeout(() => this.load(), 20);
    }
  }

  ngOnInit() {
    this.load();
    this.mediaService.load();
  }

  change() {
    
  }

  select(idx: number) {
    this.activePage = idx;
  }

  add() {
    const p: Page = {
      name: 'New page',
      url: 'new-page',
      sections: [],
    };
    this.site.pages.push(p);
    this.change();
  }

  remove(x: number) {
    if (this.site.pages.length > 1) {
      this.site.pages = this.site.pages.splice(x);
      this.change();
    }
  }

  up(x: number) {
    if (x > 0) {
      this.move(x, x - 1);
      this.change();
    }
  }

  down(x: number) {
    if (x < this.site.pages.length) {
      this.move(x, x + 1);
      this.change();
    }
  }

  move(from: number, to: number) {
    this.site.pages = [...this.site.pages.splice(to, 0, this.site.pages.splice(from, 1)[0])];
  }
}
