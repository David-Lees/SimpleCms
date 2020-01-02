import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { Site } from 'src/app/models/site';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
})
export class AdminViewComponent implements OnInit {
  site: Site;
  constructor(private siteService: SiteService) {}

  load() {
    if (this.siteService.isLoaded) {
      this.site = this.siteService.site;
    } else {
      setTimeout(() => this.load(), 20);
    }
  }

  ngOnInit() {
    this.load();
  }
}
