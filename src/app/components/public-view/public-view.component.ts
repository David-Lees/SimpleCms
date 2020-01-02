import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/models/page';

@Component({
  selector: 'app-public-view',
  templateUrl: './public-view.component.html',
})
export class PublicViewComponent implements OnInit {
  id: string;
  page: Page;

  constructor(public site: SiteService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p.id;
      this.loadSite();
    });
  }

  loadSite() {
    if (this.site.isLoaded) {
      if (this.page) {
        this.page = this.site.site.pages.find(v => {
          return v.url === this.id;
        });
      } else {
        this.page = this.site.site.pages[0];
      }
    } else {
      setTimeout(() => this.loadSite(), 10);
    }
  }
}
