import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'src/app/models/page';
import { Title } from '@angular/platform-browser';
import { Site } from '../../models/site';

@Component({
  selector: 'app-public-view',
  templateUrl: './public-view.component.html',
})
export class PublicViewComponent implements OnInit {
  id: string;
  page: Page;

  constructor(
    public siteService: SiteService,
    public route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.id = p.url;
      this.loadSite();
    });
  }

  findPage(url: string): Page {
    if (!url) {
      return this.siteService.site.pages[0];
    }
    const urls = url.split('/');
    let page: Site | Page = this.siteService.site;
    urls.forEach(x => {
      page = this.findChildPage(x, page);
    });
    return (page || this.siteService.site.pages[0]) as Page;
  }

  findChildPage(url: string, page: Site | Page): Page {
    if (page && page.pages) {
      return page.pages.find(x => x.url.toLowerCase() === url.toLowerCase());
    }
    return null;
  }

  loadSite() {
    if (this.siteService && this.siteService.isLoaded) {
      if (this.siteService.site.pages.length) {
        this.page = this.findPage(this.id);
        if (!this.page) {
          this.page = this.siteService.site.pages[0];
        }
      } else {
        this.page = this.siteService.site.pages[0];
      }
      this.titleService.setTitle(`${this.page.name} - ${this.siteService.site.name}`);
    } else {
      setTimeout(() => this.loadSite(), 10);
    }
  }
}
