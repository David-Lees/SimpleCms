import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/models/page';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-public-view',
  templateUrl: './public-view.component.html',
})
export class PublicViewComponent implements OnInit {
  id: string;
  page: Page;

  constructor(public siteService: SiteService, public route: ActivatedRoute, private titleService: Title) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p.id;
      this.loadSite();
    });
  }

  loadSite() {
    if (this.siteService && this.siteService.isLoaded) {
      if (this.siteService.site.pages.length) {
        this.page = this.siteService.site.pages.find(v => {
          return v.url === this.id;
        });
        if (!this.page) {
          this.page = this.siteService.site.pages[0];
        }
      } else {
        this.page = this.siteService.site.pages[0];
      }
      console.log(this.page, this.siteService);
      this.titleService.setTitle(`${this.page.name} - ${this.siteService.site.name}`);
    } else {
      setTimeout(() => this.loadSite(), 10);
    }
  }
}
